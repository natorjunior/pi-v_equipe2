import string
import time
import random
from datetime import timedelta
import minio
from fastapi import UploadFile, HTTPException
from minio import Minio
import os

from starlette import status

from environments.constants import MINIO_ENDPOINT, MINIO_SECRET_KEY, MINIO_SECURE, MINIO_ACCESS_KEY

minio_client = Minio(
    endpoint=MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE
)

def get_file_from_minio(bucket_name: str, file_name: str):
    try:
        url = minio_client.presigned_get_object(bucket_name, file_name, expires=timedelta(hours=24))
        return url
    except minio.error.S3Error as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )


def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def upload_file_to_minio(file: UploadFile, bucket_name: str) -> str:
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)

    random_string = generate_random_string()
    timestamp = int(time.time())
    file_name = f"{random_string}_{timestamp}{os.path.splitext(file.filename)[-1]}"

    content = file.file.read()
    file.file.seek(0)

    minio_client.put_object(
        bucket_name=bucket_name,
        object_name=file_name,
        data=file.file,
        length=len(content),
        content_type=file.content_type
    )

    return file_name