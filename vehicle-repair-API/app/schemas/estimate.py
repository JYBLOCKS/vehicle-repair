from uuid import UUID
from decimal import Decimal
from typing import List, Optional
from pydantic import Field
from app.schemas.common import ORMModel
from app.models.enums import EstimateStatus

class EstimateItemBase(ORMModel):
    kind: str = Field(pattern="^(labor|part)$")
    description: str
    quantity: Decimal = Field(gt=0)
    unit_price: Decimal = Field(ge=0)
    unit_cost: Optional[Decimal] = Field(default=None, ge=0)

class EstimateItemCreate(EstimateItemBase):
    pass

class EstimateItemOut(EstimateItemBase):
    id: UUID

class EstimateBase(ORMModel):
    vehicle_id: UUID
    status: EstimateStatus = EstimateStatus.pending
    customer_notes: Optional[str] = None
    internal_notes: Optional[str] = None
    validity_days: int = Field(ge=1, le=60, default=7)
    tax_percent: Decimal = Field(ge=0, le=100, default=13)
    discount_amount: Decimal = Field(ge=0, default=0)

class EstimateCreate(EstimateBase):
    items: List[EstimateItemCreate]

class EstimateUpdate(ORMModel):
    status: Optional[EstimateStatus] = None
    customer_notes: Optional[str] = None
    internal_notes: Optional[str] = None
    validity_days: Optional[int] = Field(default=None, ge=1, le=60)
    tax_percent: Optional[Decimal] = Field(default=None, ge=0, le=100)
    discount_amount: Optional[Decimal] = Field(default=None, ge=0)

class EstimateOut(EstimateBase):
    id: UUID
    created_by_id: Optional[UUID] = None
    items: List[EstimateItemOut] = Field(default_factory=list)
    subtotal: Decimal
    tax_amount: Decimal
    total: Decimal
