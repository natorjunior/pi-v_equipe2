from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.src.domain.dto.login_data import LoginData
from app.src.domain.service.authentication_service import AuthenticationService
from app.src.infra.database.database import get_session

router = APIRouter(prefix="/authentication")

@router.post("/login")
def login(login_data: LoginData, session: Session = Depends(get_session), avatar: UploadFile = File(None)):

    authenticated_user = AuthenticationService(session).authenticate_user(login_data, avatar)

    return {"message": "Login successful", "avatar_url": authenticated_user.avatar_url if avatar else "No avatar uploaded"}
