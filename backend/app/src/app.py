from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.src.domain.controller.authentication_controller import router as authentication_router
from app.src.domain.controller.user_controller import router as user_router
from app.src.domain.controller.group_controller import router as group_router
from app.src.domain.controller.checkin_controller import router as checkin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication_router, tags=["Authentication"])
app.include_router(user_router, tags=["User"])
app.include_router(group_router, tags=["Group"])
app.include_router(checkin_router, tags=["Check-in"])

@app.get("/")
def get_root():
    return "v0.0"