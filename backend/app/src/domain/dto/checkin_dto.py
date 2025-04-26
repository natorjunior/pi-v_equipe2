from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CheckinCreateDTO(BaseModel):
    group_id: int
    user_id: int
    title: str
    description: Optional[str] = None


class CheckinUpdateDTO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class CheckinResponseDTO(BaseModel):
    id: int
    group_id: int
    user_id: int
    title: str
    description: Optional[str] = None
    photo: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
