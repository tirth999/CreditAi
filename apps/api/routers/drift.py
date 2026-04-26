from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.drift import DriftOut, DriftHistoryOut
from ..services.drift_service import DriftService
from ..core.deps import get_db, get_current_user, require_admin

router = APIRouter()


@router.get("/latest", response_model=DriftOut)
async def latest_drift(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriftService(db)
    return await service.get_latest()


@router.get("/history")
async def drift_history(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriftService(db)
    return await service.get_history(days)


@router.post("/retrain")
async def trigger_retrain(admin=Depends(require_admin)):
    from ..tasks.retrain_task import trigger_retrain as _retrain
    job = _retrain.delay()
    return {"job_id": job.id, "status": "queued"}
