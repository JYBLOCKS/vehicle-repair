from typing import Optional
from uuid import UUID
from pydantic import EmailStr
from app.schemas.common import ORMModel

class VehicleBase(ORMModel):
    owner_name: str
    owner_phone: Optional[str] = None
    owner_email: Optional[EmailStr] = None
    brand: str
    model: str
    year: Optional[int] = None
    plate: Optional[str] = None
    vin: Optional[str] = None
    mileage: Optional[int] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class VehicleOut(VehicleBase):
    id: UUID
