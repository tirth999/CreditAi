from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.model import ModelOut, ModelListOut
from ..services.score_service import ScoreService
from ..core.deps import get_db, get_current_user, require_admin

router = APIRouter()


@router.get("/", response_model=ModelListOut)
async def list_models(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.list_models()


@router.get("/{model_id}", response_model=ModelOut)
async def get_model(
    model_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.get_model(model_id)


@router.post("/{model_id}/promote")
async def promote_model(
    model_id: str,
    db: AsyncSession = Depends(get_db),
    admin=Depends(require_admin),
):
    service = ScoreService(db)
    return await service.promote_model(model_id)
