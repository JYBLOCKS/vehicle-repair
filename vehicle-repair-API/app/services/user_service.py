from app.schemas.user import UserCreate, UserUpdate, UserRead
from app.repositories.user_base import UserRepository
import secrets

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def register(self, dto: UserCreate) -> UserRead:
        if await self.repo.get_by_email(dto.email):
            raise ValueError("email_in_use")
        password = dto.password or secrets.token_urlsafe(12)
        user = await self.repo.create(email=dto.email, name=dto.name, password=password)
        return UserRead.model_validate(user.__dict__)

    async def update(self, user_id, dto: UserUpdate) -> UserRead:
        if dto.name is not None:
            user = await self.repo.update_name(user_id, dto.name)
        else:
            user = await self.repo.get_by_id(user_id)
        if not user:
            raise LookupError("user_not_found")
        return UserRead.model_validate(user.__dict__)

    async def get(self, user_id):
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise LookupError("user_not_found")
        return UserRead.model_validate(user.__dict__)

    async def get_user_by_email(self, email: str) -> UserRead:
        user = await self.repo.get_by_email(email)
        if not user:
            raise LookupError("user_not_found")
        return UserRead.model_validate(user.__dict__)

    async def get_entity_by_email(self, email: str):
        return await self.repo.get_by_email(email)

    async def list(self, limit=50, offset=0):
        users = await self.repo.list(limit, offset)
        return [UserRead.model_validate(u.__dict__) for u in users]
