import datetime

import jwt
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

    def verify_jwt(self, token: str) -> str | None:
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])

            return payload.get("sub")

        except jwt.ExpiredSignatureError as e:
            raise e

        except jwt.InvalidTokenError as e:
            return e
