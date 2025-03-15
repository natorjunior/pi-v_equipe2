from pydantic import BaseModel

class UserChanges(BaseModel):
    name: str = None
    email: str = None
    avatar: str = None
