from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserUpdate, UserRead
from app.routers.deps.auth_deps import get_current_user
from app.routers.deps.user_deps import get_user_service
from app.services.user_service import UserService
from uuid import UUID

router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(dto: UserCreate, svc: UserService = Depends(get_user_service)):
    try:
        return await svc.register(dto)
    except ValueError:
        raise HTTPException(status_code=409, detail="email_in_use")

@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: UUID, svc: UserService = Depends(get_user_service)):
    try:
        return await svc.get(user_id)
    except LookupError:
        raise HTTPException(status_code=404, detail="user_not_found")
