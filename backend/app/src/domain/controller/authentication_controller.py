from fastapi import APIRouter

router = APIRouter(prefix="/authentication")

@router.post("/login")
def login(user,password):
    pass
