from typing import Optional

from fastapi import APIRouter, Depends, UploadFile
from fastapi.params import File, Form
from sqlalchemy.orm import Session

from app.src.domain.dto.user_dto import NewUser, UserUpdate
from app.src.domain.service.user_service import UserService
from app.src.infra.database.database import get_session
from app.src.infra.security.jwt_service import jwt_auth

router = APIRouter(prefix="/user")

@router.get("")
def get_user_by_id(user_id = Depends(jwt_auth),
                   session: Session = Depends(get_session)):
    return UserService(session).get_user_by_id(user_id)

@router.post("")
def create_user(new_user: NewUser,
                session: Session = Depends(get_session)):
    return UserService(session).create_user(new_user)

@router.put("")
def update_user_by_id(user_changes: UserUpdate,
                      user_id = Depends(jwt_auth),
                      session: Session = Depends(get_session)):
    return UserService(session).update_user(user_id, user_changes)

@router.put("/avatar")
def update_user_avatar(user_id = Depends(jwt_auth),
                       session: Session = Depends(get_session),
                       avatar: Optional[UploadFile] = File(None)):
    return UserService(session).update_user_avatar(user_id, avatar)

@router.delete("")
def delete_user_by_id(user_id = Depends(jwt_auth),
                      session: Session = Depends(get_session)):
    return UserService(session).delete_user(user_id)
