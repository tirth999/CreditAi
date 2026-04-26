import logging
from pathlib import Path
from typing import Any
import mlflow

logger = logging.getLogger(__name__)


def init_experiment(experiment_name: str = "creditai", tracking_uri: str = "./mlruns") -> str:
    mlflow.set_tracking_uri(tracking_uri)
    mlflow.set_experiment(experiment_name)
    return experiment_name


def log_training_run(
    model_name: str,
    params: dict[str, Any],
    metrics: dict[str, float],
    artifact_path: str | None = None,
    tags: dict[str, str] | None = None,
    model_version: str = "v1.0.0",
) -> str:
    """
    Log a training run to MLflow. Returns the run_id.
    """
    run_tags = {"model_name": model_name, "model_version": model_version}
    if tags:
        run_tags.update(tags)

    with mlflow.start_run(tags=run_tags) as run:
        mlflow.log_params(params)
        mlflow.log_metrics(metrics)

        if artifact_path and Path(artifact_path).exists():
            mlflow.log_artifact(artifact_path)

        return run.info.run_id


def log_fairness_metrics(
    run_id: str,
    fairness_dict: dict[str, Any],
) -> None:
    try:
        with mlflow.start_run(run_id=run_id):
            numeric_metrics = {
                k: v for k, v in fairness_dict.items()
                if isinstance(v, (int, float))
            }
            mlflow.log_metrics(numeric_metrics)
    except Exception as e:
        logger.warning(f"MLflow fairness log failed: {e}")
