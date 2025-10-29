from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.routers.deps.auth_deps import get_current_user
from app.routers.deps.estimate_deps import get_estimate_service
from app.models.user import User
from app.services.estimate_service import EstimateService
from app.schemas.estimate import EstimateCreate, EstimateUpdate, EstimateOut

router = APIRouter(prefix="/estimates", tags=["estimates"])

@router.get("/", response_model=list[EstimateOut])
async def list_estimates(
    current_user: User = Depends(get_current_user),
    svc: EstimateService = Depends(get_estimate_service),
):
    return await svc.list()

@router.post("/", response_model=EstimateOut, status_code=status.HTTP_201_CREATED)
async def create_estimate(
    payload: EstimateCreate,
    current_user: User = Depends(get_current_user),
    svc: EstimateService = Depends(get_estimate_service),
):
    return await svc.create(payload, created_by_id=current_user.id)

@router.get("/{estimate_id}", response_model=EstimateOut)
async def get_estimate(
    estimate_id: UUID,
    current_user: User = Depends(get_current_user),
    svc: EstimateService = Depends(get_estimate_service),
):
    try:
        return await svc.get(estimate_id)
    except LookupError:
        raise HTTPException(status_code=404, detail="estimate_not_found")

@router.put("/{estimate_id}", response_model=EstimateOut)
async def update_estimate(
    estimate_id: UUID,
    payload: EstimateUpdate,
    current_user: User = Depends(get_current_user),
    svc: EstimateService = Depends(get_estimate_service),
):
    try:
        return await svc.update(estimate_id, payload)
    except LookupError:
        raise HTTPException(status_code=404, detail="estimate_not_found")

@router.delete("/{estimate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_estimate(
    estimate_id: UUID,
    current_user: User = Depends(get_current_user),
    svc: EstimateService = Depends(get_estimate_service),
):
    await svc.delete(estimate_id)
    return None
