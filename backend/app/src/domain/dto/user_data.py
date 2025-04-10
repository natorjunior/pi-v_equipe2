import json
from typing import List

from pydantic import BaseModel

from app.src.domain.model.user import User


def get_user_data_instance(user:User):
    return UserData(
        name=user.name,
        email=user.email,
        avatar=user.avatar,
        motivation=user.motivation,
        genres=json.loads(user.genres)
    )


class UserData(BaseModel):
    name: str
    email: str
    avatar: str
    motivation: str
    genres: List[str]
