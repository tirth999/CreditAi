from fastapi import APIRouter, BackgroundTasks
from typing import Optional
from training.train_pipeline import run_training_pipeline

router = APIRouter()


@router.post("/train")
async def train_model(
    background_tasks: BackgroundTasks,
    model_version: Optional[str] = None,
):
    background_tasks.add_task(run_training_pipeline, model_version)
    return {"status": "training_started", "model_version": model_version}


@router.post("/drift/check")
async def check_drift():
    """Trigger a drift check — returns a mock report for now."""
    return {
        "drift_detected": False,
        "psi_scores": {},
        "ks_results": {},
        "features_drifted": [],
    }
