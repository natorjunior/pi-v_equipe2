class JwtPayload:
    def __init__(self, **kwargs):
        self.user_id = kwargs["user_id"]
        self.created_at = kwargs["created_at"]
        self.expiration = kwargs["expiration"]

    def to_dict(self):
        return {
            "sub": str(self.user_id),
            "iat": int(self.created_at.timestamp()),
            "exp": int(self.expiration.timestamp()),
        }