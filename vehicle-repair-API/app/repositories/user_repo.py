from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.core.security import hash_password
from uuid import UUID

class SqlAlchemyUserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, *, email: str, name: str, password: str) -> User:
        user = User(email=email, name=name, password_hash=hash_password(password))
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get_by_id(self, user_id: UUID) -> User | None:
        res = await self.session.execute(select(User).where(User.id == user_id))
        return res.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        res = await self.session.execute(select(User).where(User.email == email))
        return res.scalar_one_or_none()

    async def list(self, limit: int = 50, offset: int = 0):
        res = await self.session.execute(select(User).offset(offset).limit(limit))
        return list(res.scalars())

    async def update_name(self, user_id: UUID, name: str):
        await self.session.execute(
            update(User).where(User.id == user_id).values(name=name)
        )
        await self.session.commit()
        return await self.get_by_id(user_id)

    async def delete(self, user_id: UUID) -> None:
        await self.session.execute(delete(User).where(User.id == user_id))
        await self.session.commit()
