import httpx
from .celery_app import celery_app
from ..core.config import settings


@celery_app.task(name="tasks.check_drift", bind=True, max_retries=3)
def check_drift(self):
    try:
        resp = httpx.post(
            f"{settings.ML_SERVICE_URL}/ml/drift/check",
            headers={"X-API-Key": settings.ML_SERVICE_API_KEY},
            timeout=120.0,
        )
        resp.raise_for_status()
        result = resp.json()
        if result.get("drift_detected"):
            from .retrain_task import trigger_retrain
            trigger_retrain.delay()
        return result
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)
