import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(20), default="pending")

    # Traditional credit features
    payment_history_pct: Mapped[float | None]
    amounts_owed: Mapped[float | None]
    credit_utilization_ratio: Mapped[float | None]
    credit_length_months: Mapped[int | None]
    new_inquiries_6m: Mapped[int | None]
    credit_mix_count: Mapped[int | None]
    annual_income: Mapped[float | None]
    employment_status: Mapped[str | None] = mapped_column(String(50))
    zip_code: Mapped[str | None] = mapped_column(String(10))
    age: Mapped[int | None]

    # Alternative data features
    has_alt_data: Mapped[bool] = mapped_column(Boolean, default=False)
    mobile_usage_score: Mapped[float | None]
    utility_payment_ratio: Mapped[float | None]
    rental_history_months: Mapped[int | None]
    digital_payment_frequency: Mapped[float | None]
    financial_narrative_text: Mapped[str | None] = mapped_column(Text)

    # Demographic (opt-in only)
    gender: Mapped[str | None] = mapped_column(String(20))
    ethnicity: Mapped[str | None] = mapped_column(String(50))
    demographic_consented: Mapped[bool] = mapped_column(Boolean, default=False)
