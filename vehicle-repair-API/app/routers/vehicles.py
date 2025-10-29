from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.user import User
from app.routers.deps.auth_deps import get_current_user
from app.routers.deps.vehicle_deps import get_vehicle_service
from app.services.vehicle_service import VehicleService
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.get("/", response_model=list[VehicleOut])
async def list_vehicles(
    current_user: User = Depends(get_current_user),
    svc: VehicleService = Depends(get_vehicle_service),
):
    return await svc.list()

@router.post("/", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    payload: VehicleCreate,
    current_user: User = Depends(get_current_user),
    svc: VehicleService = Depends(get_vehicle_service),
):
    return await svc.create(payload)

@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle(
    vehicle_id: UUID,
    current_user: User = Depends(get_current_user),
    svc: VehicleService = Depends(get_vehicle_service),
):
    try:
        return await svc.get(vehicle_id)
    except LookupError:
        raise HTTPException(status_code=404, detail="vehicle_not_found")

@router.put("/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(
    vehicle_id: UUID,
    payload: VehicleUpdate,
    current_user: User = Depends(get_current_user),
    svc: VehicleService = Depends(get_vehicle_service),
):
    try:
        return await svc.update(vehicle_id, payload)
    except LookupError:
        raise HTTPException(status_code=404, detail="vehicle_not_found")

@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(
    vehicle_id: UUID,
    current_user: User = Depends(get_current_user),
    svc: VehicleService = Depends(get_vehicle_service),
):
    await svc.delete(vehicle_id)
    return None
