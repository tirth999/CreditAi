import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class FairnessReport(Base):
    __tablename__ = "fairness_reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    score_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scores.id"))
    model_version: Mapped[str] = mapped_column(String(50))
    demographic_parity_diff: Mapped[float | None]
    equalized_odds_diff: Mapped[float | None]
    disparate_impact_ratio: Mapped[float | None]
    statistical_parity_diff: Mapped[float | None]
    equal_opportunity_diff: Mapped[float | None]
    flags: Mapped[dict] = mapped_column(JSON, default={})
    passed_regulatory_threshold: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
