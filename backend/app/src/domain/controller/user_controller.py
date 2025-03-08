from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.src.domain.dto.new_user import NewUser
from app.src.domain.service.user_service import UserService
from app.src.infra.database.database import get_session

router = APIRouter(prefix="/user")

@router.get("")
def get_all():
    pass

@router.get("/{user_id}")
def get_user_by_id(user_id):
    pass

@router.post("")
def create_user(new_user:NewUser, session:Session = Depends(get_session)):
    return UserService(session).create_user(new_user)

@router.put("/{user_id}")
def update_user_by_id(user_id, user_changes):
    pass

@router.delete("/{user_id}")
def delete_user_by_id(user_id):
    pass