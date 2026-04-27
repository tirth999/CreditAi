from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.fairness import FairnessOut, FairnessAggregateOut
from services.fairness_service import FairnessService
from core.deps import get_db, get_current_user, require_admin

router = APIRouter()


@router.get("/{score_id}", response_model=FairnessOut)
async def get_fairness(
    score_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = FairnessService(db)
    return await service.get_by_score(score_id)


@router.get("/aggregate", response_model=FairnessAggregateOut)
async def aggregate_fairness(
    db: AsyncSession = Depends(get_db),
    admin=Depends(require_admin),
):
    service = FairnessService(db)
    return await service.aggregate()
