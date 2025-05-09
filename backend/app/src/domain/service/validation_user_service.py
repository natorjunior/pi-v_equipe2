from typing import Union
from fastapi import HTTPException
from sqlalchemy.orm import Session
from email_validator import validate_email, EmailNotValidError
from starlette import status
import re

from app.src.domain.repository.user_repository import UserRepository

commom_patterns = [
    "123456",
    "password",
    "123456789",
    "qwerty",
    "11111",
    "123123",
    "abc123",
    "password1",
    "000000",
    "iloveyou",
]


class ValidationUser:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def email_validator(self, user_email: str):
        try:
            email_info = validate_email(user_email)
            normalized_email = email_info.email

            if self.user_repository.get_user_by_email(normalized_email):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="There is already a user with this email")

        except EmailNotValidError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email")

    def password_validator(self, user_password_hash: str) -> dict:
        pwd = user_password_hash
        pwd_len = len(pwd)

        if pwd in commom_patterns or pwd.lower in commom_patterns:
            return {"Success":False, "Message": "Password to basic"}

        if pwd_len < 5 or pwd_len > 30:
            return {"Success":False, "Message": "Password must be between 5 and 30 characters"}

        if not re.search(r"[A-Z]", pwd):
            return {"Success":False, "Message": "Password must contain at least one capital letter"}

        if not re.search(r"[a-z]", pwd):
            return {"Success":False, "Message": "Password must contain at least one lowercase letter"}

        if not re.search(r"[0-9]", pwd):
            return {"Success":False, "Message": "Password must contain at least one number"}

        return {"Success": True, "Message": "Valid password"}