import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class AlternativeData(Base):
    __tablename__ = "alternative_data"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    application_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("applications.id")
    )
    source_type: Mapped[str] = mapped_column(String(50))
    raw_score: Mapped[float]
    normalized_score: Mapped[float]
    confidence: Mapped[float | None]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
