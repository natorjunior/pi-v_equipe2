from sqlalchemy.dialects.mysql import insert
from sqlalchemy.orm import Session
from app.src.domain.model.user import User


class UserRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_user_by_id(self, user_id: int):
        return self.session.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, user_email: str):
        return self.session.query(User).filter(User.email == user_email).first()

    def get_all_users(self):
        return self.session.query(User).all()

    def create_user(self, name, email, password_hash, avatar=None):
        try:
            stmt = insert(User).values(
                name=name,
                email=email,
                password_hash=password_hash,
                avatar=avatar
            )

            result = self.session.execute(stmt)
            self.session.commit()

            user_id = result.lastrowid
            return self.get_user_by_id(user_id)

        except Exception as e:
            self.session.rollback()
            raise e

    def update_user(self, user_id, name=None, email=None, avatar=None):
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        if name:
            user.name = name
        if email:
            user.email = email
        if avatar:
            user.avatar = avatar

        self.session.commit()
        self.session.refresh(user)
        return user

    def delete_user(self, user_id):
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        self.session.delete(user)
        self.session.commit()
        return True
