from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def _create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_access_token(sub: str, extra: Optional[dict] = None) -> str:
    payload = {"sub": sub, **(extra or {})}
    return _create_token(payload, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))

def create_refresh_token(sub: str, extra: Optional[dict] = None) -> str:
    payload = {"sub": sub, "type": "refresh", **(extra or {})}
    return _create_token(payload, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

class InvalidTokenError(Exception):
    pass

def get_subject(token: str) -> str:
    try:
        payload = decode_token(token)
        sub = payload.get("sub")
        if not sub:
            raise InvalidTokenError("Token missing subject")
        return sub
    except JWTError as e:
        raise InvalidTokenError(str(e))
