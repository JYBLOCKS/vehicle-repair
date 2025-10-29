from sqlalchemy.orm import Mapped, mapped_column, relationship, MappedAsDataclass
from sqlalchemy import String, Text, ForeignKey, Numeric, Enum, Integer
from sqlalchemy.ext.hybrid import hybrid_property
from app.core.db import Base, TimestampMixin, TableNameMixin, IdPK
from app.models.enums import EstimateStatus
from decimal import Decimal
from uuid import UUID

class Estimate(Base, TableNameMixin, TimestampMixin):
    id: Mapped[IdPK]

    vehicle_id: Mapped[UUID] = mapped_column(ForeignKey("vehicle.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True, index=True)

    status: Mapped[EstimateStatus] = mapped_column(Enum(EstimateStatus, name="estimate_status"), default=EstimateStatus.pending, nullable=False, index=True)
    customer_notes: Mapped[str | None] = mapped_column(Text)
    internal_notes: Mapped[str | None] = mapped_column(Text)
    validity_days: Mapped[int] = mapped_column(Integer, default=7, nullable=False)

    tax_percent: Mapped[Decimal] = mapped_column(Numeric(5,2), default=Decimal("13.00"), nullable=False)
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(12,2), default=Decimal("0.00"), nullable=False)

    vehicle: Mapped["Vehicle"] = relationship(back_populates="estimates")
    items: Mapped[list["EstimateItem"]] = relationship(back_populates="estimate", cascade="all, delete-orphan", passive_deletes=True)

    @hybrid_property
    def subtotal(self) -> Decimal:
        return sum((i.quantity * i.unit_price for i in self.items), start=Decimal("0.00"))

    @hybrid_property
    def tax_amount(self) -> Decimal:
        return (self.subtotal - self.discount_amount).max(Decimal("0.00")) * (self.tax_percent / Decimal("100"))

    @hybrid_property
    def total(self) -> Decimal:
        base = (self.subtotal - self.discount_amount).max(Decimal("0.00"))
        return (base + self.tax_amount).quantize(Decimal("0.01"))

class EstimateItem(Base, TableNameMixin, TimestampMixin):
    id: Mapped[IdPK]
    estimate_id: Mapped[UUID] = mapped_column(ForeignKey("estimate.id", ondelete="CASCADE"), nullable=False, index=True)
    kind: Mapped[str] = mapped_column(String(30), nullable=False, default="part")
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(10,2), nullable=False, default=Decimal("1.00"))
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)     
    unit_cost: Mapped[Decimal | None] = mapped_column(Numeric(12,2))

    estimate: Mapped["Estimate"] = relationship(back_populates="items")
