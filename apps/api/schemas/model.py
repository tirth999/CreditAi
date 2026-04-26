import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class ModelOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    version: str
    algorithm: str
    dataset: str
    auc_roc: float
    f1_score: float
    gini_coefficient: float
    accuracy: float
    train_date: datetime
    is_active: bool
    artifact_path: str
    parameters: Dict[str, Any]
    fairness_baseline: Dict[str, Any]
    training_samples: Optional[int] = None


class ModelListOut(BaseModel):
    models: List[ModelOut]
