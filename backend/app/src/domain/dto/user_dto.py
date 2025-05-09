import datetime
import json
from typing import List

from pydantic import BaseModel

from app.src.adapter.minio_adapter import get_file_from_minio
from app.src.domain.model.user import User


def get_user_data_instance(user: User):
    avatar_content = get_file_from_minio(bucket_name="user-avatars", file_name=user.avatar)
    return UserData(
        name=user.name,
        email=user.email,
        avatar=avatar_content,
        motivation=user.motivation,
        genres=json.loads(user.genres),
        created_at=user.created_at.date()
    )

class NewUser(BaseModel):
    name: str
    email: str
    password: str
    motivation:str
    genres: List[str]

class UserUpdate(BaseModel):
    name: str = None
    email: str = None
    motivation: str = None
    genres: List[str] = None


class UserUpdatePassword(BaseModel):
    old_password: str
    new_password: str
    new_password_confirmation: str

class UserData(BaseModel):
    name: str
    email: str
    avatar: str
    motivation: str
    genres: List[str]
    created_at: datetime.date
