from typing import List

from pydantic import BaseModel

class NewUser(BaseModel):
    name: str
    email: str
    password: str
    motivation:str
    genres: List[str]