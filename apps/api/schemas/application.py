import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    # Traditional credit features (required)
    payment_history_pct: float
    amounts_owed: float
    credit_utilization_ratio: float
    credit_length_months: int
    new_inquiries_6m: int
    credit_mix_count: int
    annual_income: float
    employment_status: str
    zip_code: str
    age: int

    # Alternative data (optional)
    has_alt_data: bool = False
    mobile_usage_score: Optional[float] = None
    utility_payment_ratio: Optional[float] = None
    rental_history_months: Optional[int] = None
    digital_payment_frequency: Optional[float] = None
    financial_narrative_text: Optional[str] = None

    # Demographic (opt-in only)
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    demographic_consented: bool = False


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    status: str
    payment_history_pct: Optional[float] = None
    amounts_owed: Optional[float] = None
    credit_utilization_ratio: Optional[float] = None
    credit_length_months: Optional[int] = None
    new_inquiries_6m: Optional[int] = None
    credit_mix_count: Optional[int] = None
    annual_income: Optional[float] = None
    employment_status: Optional[str] = None
    zip_code: Optional[str] = None
    age: Optional[int] = None
    has_alt_data: bool
    mobile_usage_score: Optional[float] = None
    utility_payment_ratio: Optional[float] = None
    rental_history_months: Optional[int] = None
    digital_payment_frequency: Optional[float] = None
    financial_narrative_text: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    demographic_consented: bool
