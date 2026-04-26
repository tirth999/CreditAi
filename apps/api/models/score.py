import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("applications.id"))
    model_version: Mapped[str] = mapped_column(String(50))
    score: Mapped[int]
    probability_of_default: Mapped[float]
    risk_tier: Mapped[str] = mapped_column(String(20))
    confidence_lower: Mapped[float | None]
    confidence_upper: Mapped[float | None]
    used_alt_data: Mapped[bool] = mapped_column(Boolean, default=False)
    used_nlp: Mapped[bool] = mapped_column(Boolean, default=False)
    computation_ms: Mapped[int | None]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
