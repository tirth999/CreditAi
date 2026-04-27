from __future__ import annotations
from typing import Optional
import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    version: Mapped[str] = mapped_column(String(20), unique=True)
    algorithm: Mapped[str] = mapped_column(String(50))
    dataset: Mapped[str] = mapped_column(String(100))
    auc_roc: Mapped[float]
    f1_score: Mapped[float]
    gini_coefficient: Mapped[float]
    accuracy: Mapped[float]
    train_date: Mapped[datetime]
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    artifact_path: Mapped[str] = mapped_column(String(500))
    parameters: Mapped[dict] = mapped_column(JSON, default={})
    fairness_baseline: Mapped[dict] = mapped_column(JSON, default={})
    training_samples: Mapped[Optional[int]]
