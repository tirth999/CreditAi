import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class DriftOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    model_version: str
    report_date: datetime
    psi_scores: Dict[str, Any]
    ks_results: Dict[str, Any]
    drift_detected: bool
    features_drifted: List[str]
    auc_at_report: Optional[float] = None
    retrain_triggered: bool


class DriftHistoryOut(BaseModel):
    history: List[Dict[str, Any]]
