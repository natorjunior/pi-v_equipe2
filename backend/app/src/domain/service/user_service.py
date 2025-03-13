from sqlalchemy.orm import Session

from app.src.domain.dto.new_user import NewUser
from app.src.domain.repository.user_repository import UserRepository
from app.src.infra.security.encryption_service import EncryptionService


class UserService:

    def __init__(self, session:Session):
        self.user_repository = UserRepository(session)
        self.encryption_service = EncryptionService()


    def get_user_by_id(self, user_id):
        pass

    def get_user_by_email(self, user_email):
        return self.user_repository.get_user_by_email(user_email)

    def get_all_users(self):
        pass

    def create_user(self, new_user:NewUser):
        password_hash = self.encryption_service.generate_hash(new_user.password)
        return self.user_repository.create_user(
            name=new_user.name,
            email=new_user.email,
            password_hash=password_hash,
            avatar=new_user.avatar
        )

    def update_user(self, user_id, name=None, email=None, avatar=None):
        pass

    def delete_user(self, user_id):
        pass