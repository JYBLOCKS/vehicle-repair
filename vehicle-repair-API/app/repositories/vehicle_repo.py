from uuid import UUID
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.vehicle import Vehicle


class SqlAlchemyVehicleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **data) -> Vehicle:
        vehicle = Vehicle(**data)
        self.session.add(vehicle)
        await self.session.commit()
        await self.session.refresh(vehicle)
        return vehicle

    async def get_by_id(self, vehicle_id: UUID) -> Vehicle | None:
        res = await self.session.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
        return res.scalar_one_or_none()

    async def list(self, limit: int = 50, offset: int = 0):
        res = await self.session.execute(select(Vehicle).offset(offset).limit(limit))
        return list(res.scalars())

    async def update(self, vehicle_id: UUID, **data) -> Vehicle | None:
        await self.session.execute(update(Vehicle).where(Vehicle.id == vehicle_id).values(**data))
        await self.session.commit()
        return await self.get_by_id(vehicle_id)

    async def delete(self, vehicle_id: UUID) -> None:
        await self.session.execute(delete(Vehicle).where(Vehicle.id == vehicle_id))
        await self.session.commit()

