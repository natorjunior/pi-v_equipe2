from pydantic import BaseModel

class NewUser(BaseModel):
    name: str
    email: str
    password: str
    avatar: str
