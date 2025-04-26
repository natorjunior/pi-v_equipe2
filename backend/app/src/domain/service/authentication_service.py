from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from starlette import status
from minio import Minio
from minio.error import S3Error

from app.src.domain.dto.login_data import LoginData
from app.src.domain.service.user_service import UserService
from app.src.infra.security.encryption_service import EncryptionService
from app.src.infra.security.jwt_service import JwtService

class AuthenticationService:
    def __init__(self, session: Session):
        self.encryption_service = EncryptionService()
        self.jwt_service = JwtService()
        self.user_service = UserService(session)

        self.minio_client = Minio(
            "minio:9000",
            access_key="chavedeacesso",
            secret_key="supersecretchave",
            secure=False
        )

    def authenticate_user(self, login_data: LoginData, avatar: UploadFile = None):
        user = self.user_service.get_user_by_email(login_data.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid credentials"
            )

        if not self.encryption_service.verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid credentials"
            )

        if avatar:
            avatar_url = self.upload_image_to_minio(avatar)
            user.avatar_url = avatar_url
            self.user_service.save_user(user)

        return user

    def upload_image_to_minio(self, file) -> str:
        bucket_name = "avatars"
        try:
            if not self.minio_client.bucket_exists(bucket_name):
                self.minio_client.make_bucket(bucket_name)

            file_location = f"user_avatar/{file.filename}"
            self.minio_client.put_object(
                bucket_name,
                file_location,
                file.file,
                file.size
            )

            return f"http://localhost:9000/{bucket_name}/{file_location}"
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"MinIO Error: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {e}")

    def get_user_by_jwt(self, token: str):
        user_id = self.jwt_service.verify_jwt(token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        user = self.user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
