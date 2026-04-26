import os
from celery import Celery

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")

celery_app = Celery(
    "creditai",
    broker=f"{redis_url}/0",
    backend=f"{redis_url}/1",
    include=[
        "apps.api.tasks.retrain_task",
        "apps.api.tasks.drift_check_task",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "apps.api.tasks.retrain_task.*": {"queue": "retraining"},
        "apps.api.tasks.drift_check_task.*": {"queue": "scoring"},
    },
)
