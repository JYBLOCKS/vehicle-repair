from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.repositories.estimate_repo import SqlAlchemyEstimateRepository
from app.services.estimate_service import EstimateService


def get_estimate_service(db: AsyncSession = Depends(get_session)) -> EstimateService:
    repo = SqlAlchemyEstimateRepository(db)
    return EstimateService(repo)

