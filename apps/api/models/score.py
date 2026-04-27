from __future__ import annotations
from typing import Optional
import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("applications.id"))
    model_version: Mapped[str] = mapped_column(String(50))
    score: Mapped[int]
    probability_of_default: Mapped[float]
    risk_tier: Mapped[str] = mapped_column(String(20))
    confidence_lower: Mapped[Optional[float]]
    confidence_upper: Mapped[Optional[float]]
    used_alt_data: Mapped[bool] = mapped_column(Boolean, default=False)
    used_nlp: Mapped[bool] = mapped_column(Boolean, default=False)
    computation_ms: Mapped[Optional[int]]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
