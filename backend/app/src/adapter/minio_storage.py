from fastapi import UploadFile
from minio import Minio
import os

from backend.environments import (
    MINIO_ENDPOINT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    MINIO_SECURE,
)

minio_client = Minio(
    endpoint=MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE
)

def upload_file_to_minio(file: UploadFile, bucket_name: str = "user-avatars") -> str:
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)

    file_name = file.filename
    file_path = os.path.join(bucket_name, file_name)

    content = file.file.read()
    file.file.seek(0)

    minio_client.put_object(
        bucket_name=bucket_name,
        object_name=file_path,
        data=file.file,
        length=len(content),
        content_type=file.content_type
    )

    return f"http://{MINIO_ENDPOINT}/{bucket_name}/{file_path}"
