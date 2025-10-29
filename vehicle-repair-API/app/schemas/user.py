from pydantic import EmailStr, Field
from uuid import UUID
from app.schemas.common import ORMModel


class UserBase(ORMModel):
    email: EmailStr
    name: str


class UserLogin(ORMModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserCreate(UserBase):
    password: str | None = Field(default=None, min_length=8)


class UserUpdate(ORMModel):
    name: str | None = None


class UserRead(UserBase):
    id: UUID
