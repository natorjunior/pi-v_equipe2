from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/authentication")

@router.post("/login")
def login(user,password):
    pass
