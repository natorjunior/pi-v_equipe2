import subprocess
import uvicorn

if __name__ == "__main__":
    subprocess.run(["alembic", "upgrade", "head"])
    
    uvicorn.run("app.src.app:app", host="0.0.0.0", port=8080, reload=True)
