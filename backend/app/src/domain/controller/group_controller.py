from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.src.domain.dto.group_dto import NewGroup
from app.src.domain.service.group_service import GroupService
from app.src.infra.database.database import get_session
from app.src.infra.security.jwt_service import jwt_auth

router = APIRouter(prefix="/group")

@router.get("")
def get_group_by_user_id(user_id = Depends(jwt_auth),
                         session: Session = Depends(get_session)):
    return GroupService(session).get_group_by_user_id(user_id)

@router.post("")
def create_group(new_group: NewGroup,
                 user_id:int = Depends(jwt_auth),
                 session: Session = Depends(get_session)):
    return GroupService(session).create_group(user_id, new_group)

@router.delete("/{group_id}")
def delete_group(group_id:int,
                 user_id:int = Depends(jwt_auth),
                 session: Session = Depends(get_session)):
    return GroupService(session).delete_group(user_id, group_id)

@router.get("/join/{group_alias}")
def join_group(group_alias:str,
               user_id = Depends(jwt_auth),
               session: Session = Depends(get_session)):
    return GroupService(session).join_group(user_id, group_alias)

@router.get("/leave/{group_alias}")
def leave_group(group_alias:str,
                user_id = Depends(jwt_auth),
                session: Session = Depends(get_session)):
    return GroupService(session).leave_group(user_id, group_alias)