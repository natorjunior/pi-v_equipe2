# Build stage
FROM python:3.12-slim-bullseye AS builder
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.12-slim-bullseye
WORKDIR /app
COPY --from=builder /usr/local /usr/local
COPY . .

EXPOSE 8080

# Run stage
CMD ["python", "run.py"]