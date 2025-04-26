from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.src.adapter.minio_adapter import get_file_from_minio
from app.src.domain.dto.user_dto import UserData
from app.src.domain.model.checkin import Checkin


def get_checkin_data_instance(checkin:Checkin, user:UserData):
    photo = get_file_from_minio(bucket_name="checkin-photo", file_name=checkin.photo)
    return CheckinData(
        id = checkin.id,
        group_id=checkin.group_id,
        user=user,
        title=checkin.title,
        description=checkin.description,
        photo=photo,
        created_at=checkin.created_at,
        updated_at=checkin.updated_at
    )

class CheckinCreate(BaseModel):
    group_id: int
    title: str
    description: Optional[str] = None


class CheckinUpdate(BaseModel):
    checkin_id: int
    title: Optional[str] = None
    description: Optional[str] = None


class CheckinData(BaseModel):
    id: int
    group_id: int
    user: UserData
    title: str
    description: Optional[str] = None
    photo: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
