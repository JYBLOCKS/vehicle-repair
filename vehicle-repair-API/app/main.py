from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth as auth_router
from app.routers import users as users_router
from app.routers import vehicles as vehicles_router
from app.routers import estimates as estimates_router
from app.core.db import Base, engine

app = FastAPI(title="Vehicle Repair API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def log_options(request, call_next):
    if request.method == "OPTIONS":
        print(">>> OPTIONS from", request.headers.get("origin"), request.url.path)
        print(">>> ACRM:", request.headers.get("access-control-request-method"))
        print(">>> ACRH:", request.headers.get("access-control-request-headers"))
    response = await call_next(request)
    return response

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(vehicles_router.router)
app.include_router(estimates_router.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
