from __future__ import annotations
from typing import Optional
import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(20), default="pending")

    # Traditional credit features
    payment_history_pct: Mapped[Optional[float]]
    amounts_owed: Mapped[Optional[float]]
    credit_utilization_ratio: Mapped[Optional[float]]
    credit_length_months: Mapped[Optional[int]]
    new_inquiries_6m: Mapped[Optional[int]]
    credit_mix_count: Mapped[Optional[int]]
    annual_income: Mapped[Optional[float]]
    employment_status: Mapped[Optional[str]] = mapped_column(String(50))
    zip_code: Mapped[Optional[str]] = mapped_column(String(10))
    age: Mapped[Optional[int]]

    # Alternative data features
    has_alt_data: Mapped[bool] = mapped_column(Boolean, default=False)
    mobile_usage_score: Mapped[Optional[float]]
    utility_payment_ratio: Mapped[Optional[float]]
    rental_history_months: Mapped[Optional[int]]
    digital_payment_frequency: Mapped[Optional[float]]
    financial_narrative_text: Mapped[Optional[str]] = mapped_column(Text)

    # Demographic (opt-in only)
    gender: Mapped[Optional[str]] = mapped_column(String(20))
    ethnicity: Mapped[Optional[str]] = mapped_column(String(50))
    demographic_consented: Mapped[bool] = mapped_column(Boolean, default=False)
