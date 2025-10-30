
ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates tzdata curl \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser
WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic.ini ./
COPY migrations ./migrations

RUN mkdir -p /app/data

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

ENV DATABASE_URL="sqlite+aiosqlite:///./data/data.db"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

