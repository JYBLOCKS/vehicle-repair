from app.repositories.vehicle_base import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut
from uuid import UUID


class VehicleService:
    def __init__(self, repo: VehicleRepository):
        self.repo = repo

    async def create(self, dto: VehicleCreate) -> VehicleOut:
        vehicle = await self.repo.create(**dto.model_dump(exclude_unset=True))
        return VehicleOut.model_validate(vehicle.__dict__)

    async def get(self, vehicle_id: UUID) -> VehicleOut:
        v = await self.repo.get_by_id(vehicle_id)
        if not v:
            raise LookupError("vehicle_not_found")
        return VehicleOut.model_validate(v.__dict__)

    async def list(self, limit: int = 50, offset: int = 0) -> list[VehicleOut]:
        items = await self.repo.list(limit, offset)
        return [VehicleOut.model_validate(v.__dict__) for v in items]

    async def update(self, vehicle_id: UUID, dto: VehicleUpdate) -> VehicleOut:
        v = await self.repo.update(vehicle_id, **dto.model_dump(exclude_unset=True))
        if not v:
            raise LookupError("vehicle_not_found")
        return VehicleOut.model_validate(v.__dict__)

    async def delete(self, vehicle_id: UUID) -> None:
        await self.repo.delete(vehicle_id)
