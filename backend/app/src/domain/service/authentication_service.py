from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette import status

from app.src.domain.dto.login_data import LoginData
from app.src.domain.service.user_service import UserService
from app.src.infra.security.encryption_service import EncryptionService
from app.src.infra.security.jwt_service import JwtService


class AuthenticationService:
    def __init__(self, session: Session):
        self.encryption_service = EncryptionService()
        self.jwt_service = JwtService()
        self.user_service = UserService(session)

    def authenticate_user(self, login_data: LoginData):
        user = self.user_service.get_user_by_email(login_data.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Credenciais inválidas"
            )

        if not self.encryption_service.verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Credenciais inválidas"
            )
        return self.jwt_service.generate_jwt(user_id=user.id)

    def get_user_by_jwt(self, token: str):
        user_id = self.jwt_service.verify_jwt(token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirado ou inválido"
            )
        user = self.user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        return user