import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.fairness_report import FairnessReport
from schemas.fairness import FairnessOut, FairnessAggregateOut


class FairnessService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_score(self, score_id: str) -> FairnessOut:
        try:
            score_uuid = uuid.UUID(score_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid score_id")

        result = await self.db.execute(
            select(FairnessReport).where(FairnessReport.score_id == score_uuid)
        )
        report = result.scalar_one_or_none()
        if not report:
            raise HTTPException(status_code=404, detail="Fairness report not found")
        return report

    async def aggregate(self) -> FairnessAggregateOut:
        result = await self.db.execute(
            select(
                FairnessReport.model_version,
                func.avg(FairnessReport.demographic_parity_diff).label("avg_dp"),
                func.avg(FairnessReport.equalized_odds_diff).label("avg_eo"),
                func.avg(FairnessReport.disparate_impact_ratio).label("avg_dir"),
                func.avg(
                    func.cast(FairnessReport.passed_regulatory_threshold, func.Float)
                ).label("pass_rate"),
                func.count(FairnessReport.id).label("total"),
            ).group_by(FairnessReport.model_version)
        )
        row = result.first()
        if not row:
            return FairnessAggregateOut(
                model_version="N/A",
                pass_rate=1.0,
                total_applications=0,
            )
        return FairnessAggregateOut(
            model_version=row.model_version,
            avg_demographic_parity_diff=row.avg_dp,
            avg_equalized_odds_diff=row.avg_eo,
            avg_disparate_impact_ratio=row.avg_dir,
            pass_rate=float(row.pass_rate or 1.0),
            total_applications=row.total,
        )
