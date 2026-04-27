from __future__ import annotations
from typing import Optional
import httpx
from tasks.celery_app import celery_app
from core.config import settings


@celery_app.task(name="tasks.trigger_retrain", bind=True, max_retries=3)
def trigger_retrain(self, model_version: Optional[str] = None):
    try:
        resp = httpx.post(
            f"{settings.ML_SERVICE_URL}/ml/train",
            headers={"X-API-Key": settings.ML_SERVICE_API_KEY},
            json={"model_version": model_version},
            timeout=600.0,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
