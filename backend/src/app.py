from fastapi import FastAPI

from backend.src.app import router as authentication_router
from backend.src.domain.controller.user_controller import router as user_router
from backend.src.app import router as group_router
from backend.src.app import router as checkin_router


app = FastAPI()

app.include_router(authentication_router, tags=["Authentication"])
app.include_router(user_router, tags=["User"])
app.include_router(group_router, tags=["Group"])
app.include_router(checkin_router, tags=["Check-in"])

@app.get("/")
def get_root():
    return "v0.0"