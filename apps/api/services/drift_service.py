from datetime import datetime, timedelta
from typing import Any, Dict, List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.drift_report import DriftReport
from ..schemas.drift import DriftOut, DriftHistoryOut


class DriftService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_latest(self) -> DriftOut:
        result = await self.db.execute(
            select(DriftReport).order_by(DriftReport.report_date.desc()).limit(1)
        )
        report = result.scalar_one_or_none()
        if not report:
            raise HTTPException(status_code=404, detail="No drift reports found")
        return report

    async def get_history(self, days: int = 30) -> Dict[str, List[Dict[str, Any]]]:
        since = datetime.utcnow() - timedelta(days=days)
        result = await self.db.execute(
            select(DriftReport)
            .where(DriftReport.report_date >= since)
            .order_by(DriftReport.report_date.asc())
        )
        reports = result.scalars().all()
        return {
            "history": [
                {
                    "date": r.report_date.isoformat(),
                    "psi_scores": r.psi_scores,
                    "drift_detected": r.drift_detected,
                    "features_drifted": r.features_drifted,
                }
                for r in reports
            ]
        }
