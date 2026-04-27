from __future__ import annotations
from typing import Optional
import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, JSON
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class DriftReport(Base):
    __tablename__ = "drift_reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    model_version: Mapped[str] = mapped_column(String(50))
    report_date: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    psi_scores: Mapped[dict] = mapped_column(JSON)
    ks_results: Mapped[dict] = mapped_column(JSON)
    drift_detected: Mapped[bool] = mapped_column(Boolean, default=False)
    features_drifted: Mapped[list] = mapped_column(ARRAY(String), default=[])
    auc_at_report: Mapped[Optional[float]]
    retrain_triggered: Mapped[bool] = mapped_column(Boolean, default=False)
