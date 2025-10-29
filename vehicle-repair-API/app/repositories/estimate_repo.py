from uuid import UUID
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.estimate import Estimate, EstimateItem


class SqlAlchemyEstimateRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **data) -> Estimate:
        items_data = data.pop("items", [])
        estimate = Estimate(**data)
        self.session.add(estimate)
        await self.session.flush()
        for item in items_data:
            self.session.add(EstimateItem(estimate_id=estimate.id, **item))
        await self.session.commit()
        await self.session.refresh(estimate)
        return estimate

    async def get_by_id(self, estimate_id: UUID) -> Estimate | None:
        res = await self.session.execute(select(Estimate).where(Estimate.id == estimate_id))
        return res.scalar_one_or_none()

    async def list(self, limit: int = 50, offset: int = 0):
        res = await self.session.execute(select(Estimate).offset(offset).limit(limit))
        return list(res.scalars())

    async def update(self, estimate_id: UUID, **data) -> Estimate | None:
        data.pop("items", None)
        await self.session.execute(update(Estimate).where(Estimate.id == estimate_id).values(**data))
        await self.session.commit()
        return await self.get_by_id(estimate_id)

    async def delete(self, estimate_id: UUID) -> None:
        await self.session.execute(delete(Estimate).where(Estimate.id == estimate_id))
        await self.session.commit()
