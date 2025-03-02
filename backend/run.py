import uvicorn

from app.src.app import app

if __name__ == "__main__":
    uvicorn.run("app.src.app:app", host="0.0.0.0", port=8080, reload=True)
