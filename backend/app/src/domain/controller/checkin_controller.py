from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.src.domain.service.checkin_service import CheckinService
from app.src.domain.dto.checkin_dto import CheckinCreate, CheckinUpdate
from app.src.infra.database.database import get_session
from app.src.infra.security.jwt_service import jwt_auth

router = APIRouter(prefix="/check-in")


@router.get("/user")
def get_checkins_by_user(user_id:int = Depends(jwt_auth),
                         session: Session = Depends(get_session)):
    return CheckinService(session).get_checkins_by_user_id(user_id)

@router.get("/group/{group_id}")
def get_checkins_by_group(group_id: int,
                          user_id: int = Depends(jwt_auth),
                          session: Session = Depends(get_session)):
    return CheckinService(session).get_checkins_by_group_id(user_id, group_id)

@router.post("")
def create_checkin(checkin_data: CheckinCreate,
                   photo: Optional[UploadFile] = File(None),
                   user_id: int = Depends(jwt_auth),
                   session: Session = Depends(get_session)):
    return CheckinService(session).create_checkin(user_id, checkin_data=checkin_data, photo=photo)

@router.put("/{checkin_id}")
def update_checkin_by_id(checkin_changes: CheckinUpdate,
                         checkin_photo: Optional[UploadFile] = File(None),
                         user_id: int = Depends(jwt_auth),
                         session: Session = Depends(get_session)):
    return CheckinService(session).update_checkin_by_id(user_id, checkin_changes, checkin_photo)


@router.delete("/{checkin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_checkin_by_id(checkin_id: int,
                         user_id:int = Depends(jwt_auth),
                         session: Session = Depends(get_session)):
    return CheckinService(session).delete_checkin_by_id(user_id, checkin_id)

@router.get("/group/{group_id}/ranking")
def get_group_ranking(group_id: int,
                      user_id: int = Depends(jwt_auth),
                      session: Session = Depends(get_session)):
    return CheckinService(session).get_group_ranking(user_id, group_id)
