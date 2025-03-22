import datetime
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from starlette import status

from app.src.domain.dto.jwt_payload import JwtPayload
from environments import constants


class JwtService:
    def __init__(self):
        self.jwt_secret = constants.JWT_SECRET


    def generate_jwt(self, user_id):
        payload = JwtPayload(
            user_id=user_id,
            created_at=datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc),
            expiration=datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc) + datetime.timedelta(hours=72)
        ).to_dict()

        token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")

        return token

    def verify_jwt(self, token: str) -> int:
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            user_id = int(payload.get("sub"))
            return user_id

        except jwt.ExpiredSignatureError as e:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Session expired"
            )

        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid credentials"
            )

oauth2_scheme = HTTPBearer()

def jwt_auth(token: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)]):
    return JwtService().verify_jwt(token=token.credentials)
