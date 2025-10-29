from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer
from app.core.db import Base, TimestampMixin, TableNameMixin, IdPK

class Vehicle(Base, TableNameMixin, TimestampMixin):
    id: Mapped[IdPK]
    owner_name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_phone: Mapped[str | None] = mapped_column(String(50))
    owner_email: Mapped[str | None] = mapped_column(String(255))
    brand: Mapped[str] = mapped_column(String(100), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[int | None] = mapped_column(Integer)
    plate: Mapped[str | None] = mapped_column(String(50), index=True)
    vin: Mapped[str | None] = mapped_column(String(50), index=True)
    mileage: Mapped[int | None] = mapped_column(Integer)

    estimates: Mapped[list["Estimate"]] = relationship(back_populates="vehicle", cascade="all,delete", passive_deletes=True)
