from sqlalchemy.orm import Mapped,  mapped_column, relationship
from sqlalchemy import String
from app.core.db import Base, TimestampMixin, TableNameMixin, IdPK

class User(Base, TableNameMixin, TimestampMixin):
    id: Mapped[IdPK]
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
