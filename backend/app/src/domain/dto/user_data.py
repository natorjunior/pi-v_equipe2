from pydantic import BaseModel

from app.src.domain.model.user import User


def get_user_data_instance(user:User):
    return UserData(
        name=user.name,
        email=user.name,
        avatar=user.avatar
    )


class UserData(BaseModel):
    name: str
    email: str
    avatar: str

