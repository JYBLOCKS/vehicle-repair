from pydantic import BaseModel, Field, EmailStr, ConfigDict
from decimal import Decimal
from typing import Optional
from uuid import UUID

class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
