from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.score import ScoreCreate, ScoreOut, ScoreJobOut, ScoreStatusOut
from services.score_service import ScoreService
from core.deps import get_db, get_current_user

router = APIRouter()


@router.post("/score", response_model=ScoreJobOut)
async def create_score(
    data: ScoreCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.create_score(data, current_user.id)


@router.get("/score/status/{job_id}", response_model=ScoreStatusOut)
async def score_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.get_status(job_id)


@router.get("/score/{score_id}", response_model=ScoreOut)
async def get_score(
    score_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.get_score(score_id)


@router.get("/scores")
async def list_scores(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 10,
):
    service = ScoreService(db)
    return await service.list_scores(current_user.id, skip, limit)
