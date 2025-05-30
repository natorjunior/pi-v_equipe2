from fastapi import Form
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from zoneinfo import ZoneInfo

from app.src.adapter.minio_adapter import get_file_from_minio
from app.src.domain.dto.user_dto import UserData
from app.src.domain.model.checkin import Checkin


def get_checkin_data_instance(checkin:Checkin, user:UserData):
    photo = get_file_from_minio(bucket_name="checkin-photos", file_name=checkin.photo)
    
    tz_fortaleza = ZoneInfo("America/Fortaleza")

    checkin.created_at = checkin.created_at.astimezone(tz_fortaleza)
    checkin.updated_at = checkin.updated_at.astimezone(tz_fortaleza)
   
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

    @classmethod
    def as_form(
        cls,
        group_id: int = Form(...),
        title: str = Form(...),
        description: Optional[str] = Form(None),
    ):
        return cls(
            group_id=group_id,
            title=title,
            description=description,
        )


class CheckinUpdate(BaseModel):
    checkin_id: int
    title: Optional[str] = None
    description: Optional[str] = None

    @classmethod
    def as_form(
        cls,
        checkin_id: int = Form(...),
        title: str = Form(...),
        description: Optional[str] = Form(None),
    ):
        return cls(
            checkin_id=checkin_id,
            title=title,
            description=description,
        )

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
