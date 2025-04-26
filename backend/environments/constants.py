import os
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACESS_KEY = os.getenv("MINIO_ACESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "checkin-photos")

DEFAULT_AVATAR_URL = os.getenv("DEFAULT_AVATAR_URL")