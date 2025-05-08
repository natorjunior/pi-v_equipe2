import json

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from starlette import status

from app.src.adapter.minio_adapter import upload_file_to_minio
from app.src.domain.dto.user_dto import get_user_data_instance, NewUser, UserUpdate
from app.src.domain.repository.user_repository import UserRepository
from app.src.infra.security.encryption_service import EncryptionService
from environments.constants import MINIO_ENDPOINT


class UserService:

    def __init__(self, session:Session):
        self.user_repository = UserRepository(session)
        self.encryption_service = EncryptionService()


    def get_user_by_id(self, user_id):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return get_user_data_instance(user)

    def get_user_by_email(self, user_email):
        return self.user_repository.get_user_by_email(user_email)

    def create_user(self, new_user:NewUser):
        if self.get_user_by_email(new_user.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="There is already a user with this email"
            )

        password_hash = self.encryption_service.generate_hash(new_user.password)
        self.user_repository.create_user(
            name=new_user.name,
            email=new_user.email,
            password_hash=password_hash,
            motivation=new_user.motivation,
            genres=json.dumps(new_user.genres),
            avatar="default_avatar.jpeg"
        )

    def update_user(self, user_id, user_changes: UserUpdate):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        updated_user = self.user_repository.update_user(user_id, user_changes)
        return get_user_data_instance(updated_user)

    def update_user_avatar(self, user_id, avatar: UploadFile):
        avatar_url = "default_avatar.jpeg"
        if avatar:
            avatar_url = upload_file_to_minio(avatar, "user-avatars")
        updated_user = self.user_repository.set_user_avatar(user_id, avatar_url)
        return get_user_data_instance(updated_user)

    def delete_user(self, user_id):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return self.user_repository.delete_user(user_id)