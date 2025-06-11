import csv
import os
from datetime import datetime

from fastapi import Request
from time import time

from starlette.middleware.base import BaseHTTPMiddleware

from app.src.infra.security.jwt_service import JwtService

CSV_FILE = "./logs/log_requests.csv"

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["timestamp", "user_id", "method", "url", "status_code", "response_time_ms"])


class LogRequestMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        start_time = time()
        user_id = "unknown"
        try:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                user_id = JwtService().verify_jwt(token)
        except Exception as e:
            pass

        response = await call_next(request)
        end_time = time()

        log_data = [
            datetime.now().isoformat(),
            user_id,
            request.method,
            request.url.path,
            response.status_code,
            round((end_time - start_time) * 1000, 2)
        ]

        with open(CSV_FILE, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(log_data)

        return response