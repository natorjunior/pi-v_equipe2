from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.src.domain.dto.login_data import LoginData
from app.src.domain.service.authentication_service import AuthenticationService
from app.src.infra.database.database import get_session

router = APIRouter(prefix="/authentication")

@router.post("/login")
def login(login_data:LoginData, session:Session = Depends(get_session)):
    return AuthenticationService(session).authenticate_user(login_data)
