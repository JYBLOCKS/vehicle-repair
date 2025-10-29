# WHAT YOU’LL BUILD

## A small, containerized web app to manage vehicle repair estimates with:

• A Python (FastAPI) REST API (login, list estimates with status filter, create estimate, update status).
• A simple React UI (login, table listing, create form).
• Docker Compose to run everything locally.
You can complete the core scope and optionally do bonus items for extra credit.
How to run the project

1. Unzip the attachment into a folder on your machine.
2. Open a terminal in that folder and run:
3. cp .env.sample .env
4. docker-compose up --build
5. Open:
   API docs: http://localhost:8000/docs
   Frontend: http://localhost:5173

## If Docker is not available, candidates may run backend and frontend locally (instructions are inside the repo), but Docker is preferred.

### What to deliver

• A public GitHub link to your solution (or a ZIP if you prefer).
• Include:
• Your code for backend and frontend.
• docker-compose.yml and any config you changed.
• At least one backend test (e.g., using pytest).
• A brief AWS deployment outline in the README (5–8 bullets: how you’d deploy using ECS/Lambda, S3+CloudFront, RDS, IAM, secrets, CI/CD).

## Evaluation

• API correctness, validation, and clean error handling.
• A working React UI that uses the API (login, list + filter, create).
• Clear, organized code and a short README with run steps.
• Docker setup that works on a clean machine.
• (Optional bonus) Pagination, simple rate-limiting, migrations, React Query, CI, healthcheck.

# Backend how to run

docker build --no-cache -t vehicle-repair-API .

docker run --rm --name vehicle-repair-API-cluster -p 8000:8000 -e DATABASE_URL="sqlite+aiosqlite:///./data/data.db" -v "$(pwd)/data:/app/data" vehicle-repair-API

# Frontend how to run

docker build --no-cache -t vehicle-repair-web .

docker run --rm --name vehicle-repair-web-cluster -p 5173:5173 vehicle-repair-web
