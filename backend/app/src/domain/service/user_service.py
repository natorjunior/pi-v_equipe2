import json

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from starlette import status

from app.src.adapter.minio_adapter import upload_file_to_minio
from app.src.domain.dto.user_dto import get_user_data_instance, NewUser, UserUpdate, UserUpdatePassword
from app.src.domain.repository.user_repository import UserRepository
from app.src.domain.service.validation_user_service import ValidationUser
from app.src.infra.security.encryption_service import EncryptionService


class UserService:

    def __init__(self, session: Session):
        self.user_repository = UserRepository(session)
        self.encryption_service = EncryptionService()
        self.validation = ValidationUser(self.user_repository)


    def get_user_by_id(self, user_id):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontado"
            )
        return get_user_data_instance(user)

    def get_user_by_email(self, user_email):
        return self.user_repository.get_user_by_email(user_email)

    def create_user(self, new_user: NewUser):
        self.validation.email_validator(new_user.email)
        valid_password = self.validation.password_validator(new_user.password)
        if not valid_password["Success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=valid_password["Message"],
            )

        password_hash = self.encryption_service.generate_hash(new_user.password)

        created_user = self.user_repository.create_user(
            name=new_user.name,
            email=new_user.email,
            password_hash=password_hash,
            motivation=new_user.motivation,
            genres=json.dumps(new_user.genres),
            avatar="default_avatar.jpeg",
        )

        return created_user

    def update_user(self, user_id, user_changes: UserUpdate):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontado"
            )
        user.name = user_changes.name
        user.email = user_changes.email
        user.motivation = user_changes.motivation
        user.genres = json.dumps(user_changes.genres)
        updated_user = self.user_repository.update_user(user_id, user)
        return get_user_data_instance(updated_user)

    def update_user_password(self, user_id, user_changes: UserUpdatePassword):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email ou senha incorretos"
            )
        if not self.encryption_service.verify_password(user.password_hash, user_changes.old_password):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email ou senha incorretos"
            )
        valid_password = self.validation.password_validator(user_changes.new_password)
        if not valid_password["Success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=valid_password["Message"],
            )
        password_hash = self.encryption_service.generate_hash(user_changes.new_password)
        self.user_repository.update_user_password(user_id, password_hash)

    def update_user_avatar(self, user_id, avatar: UploadFile):
        avatar_url = "default_avatar.jpeg"
        if avatar:
            avatar_url = upload_file_to_minio(avatar, "user-avatars")
        updated_user = self.user_repository.set_user_avatar(user_id, avatar_url)
        return get_user_data_instance(updated_user)

    def delete_user(self, user_id: int):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        self.user_repository.delete_user(user_id)
        return {"detail": "Usuário deletado com sucesso"}