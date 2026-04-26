import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class ShapValue(Base):
    __tablename__ = "shap_values"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    score_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scores.id"))
    feature_name: Mapped[str] = mapped_column(String(100))
    feature_value: Mapped[float | None]
    shap_value: Mapped[float]
    rank: Mapped[int]
    direction: Mapped[str] = mapped_column(String(10))
