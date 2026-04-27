import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from schemas.fairness import FairnessOut


class ShapValueOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    feature_name: str
    feature_value: Optional[float] = None
    shap_value: float
    rank: int
    direction: str


class ScoreCreate(BaseModel):
    application_id: uuid.UUID


class ScoreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    application_id: uuid.UUID
    model_version: str
    score: int
    probability_of_default: float
    risk_tier: str
    confidence_lower: Optional[float] = None
    confidence_upper: Optional[float] = None
    used_alt_data: bool
    used_nlp: bool
    computation_ms: Optional[int] = None
    created_at: datetime
    shap_values: List[ShapValueOut] = []
    fairness: Optional[FairnessOut] = None
    adverse_action: Dict[str, Any] = {}


class ScoreJobOut(BaseModel):
    job_id: str
    status: str


class ScoreStatusOut(BaseModel):
    status: str
    score_id: Optional[uuid.UUID] = None
