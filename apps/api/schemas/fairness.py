import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class FairnessOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    score_id: uuid.UUID
    model_version: str
    demographic_parity_diff: Optional[float] = None
    equalized_odds_diff: Optional[float] = None
    disparate_impact_ratio: Optional[float] = None
    statistical_parity_diff: Optional[float] = None
    equal_opportunity_diff: Optional[float] = None
    flags: Dict[str, Any] = {}
    passed_regulatory_threshold: bool
    created_at: datetime


class FairnessAggregateOut(BaseModel):
    model_version: str
    avg_demographic_parity_diff: Optional[float] = None
    avg_equalized_odds_diff: Optional[float] = None
    avg_disparate_impact_ratio: Optional[float] = None
    pass_rate: float
    total_applications: int
