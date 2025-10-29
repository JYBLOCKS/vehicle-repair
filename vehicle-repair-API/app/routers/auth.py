from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.schemas.auth import LoginIn, TokenOut
from app.services.user_service import UserService
from app.routers.deps.user_deps import get_user_service
from app.core.security import verify_password, create_access_token, create_refresh_token, get_subject, InvalidTokenError

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_session), svc: UserService = Depends(get_user_service)):
    user = await svc.get_entity_by_email(payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="token not valid")
    access = create_access_token(sub=user.email, extra={"uid": str(user.id)})
    refresh = create_refresh_token(sub=user.email)
    return TokenOut(access_token=access, refresh_token=refresh)

@router.post("/refresh", response_model=TokenOut)
async def refresh_token(refresh_token: str):
    try:
        sub = get_subject(refresh_token)
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not valid")
    new_access = create_access_token(sub=sub)
    return TokenOut(access_token=new_access)
