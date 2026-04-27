import logging
import os
from pathlib import Path
from typing import Any
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

try:
    import scorecardpy as sc
    SCORECARDPY_AVAILABLE = True
except Exception:
    SCORECARDPY_AVAILABLE = False


def _load_dataset() -> pd.DataFrame:
    """Load best available dataset in priority order."""
    data_dir = Path("data/processed")

    for parquet in [
        "home_credit.parquet",
        "german_credit.parquet",
        "australian_credit.parquet",
        "folktables_acs.parquet",
        "synthetic_credit.parquet",
    ]:
        path = data_dir / parquet
        if path.exists():
            df = pd.read_parquet(path)
            logger.info(f"Loaded dataset: {parquet} ({len(df)} rows)")
            return df

    logger.warning("No dataset found — generating synthetic data")
    from data.synthetic_gen import generate_full_dataset
    return generate_full_dataset(n=5000)


async def run_training_pipeline(model_version: str | None = None) -> dict[str, Any]:
    from data.preprocess import impute, encode_categoricals, apply_smote
    from models.logistic_model import LogisticModel
    from models.xgboost_model import XGBoostModel
    from models.lightgbm_model import LightGBMModel
    from xai.ebm_explainer import EBMExplainer
    from training.evaluate import evaluate_model
    from training.time_series_cv import OutOfTimeValidator
    from training.mlflow_tracking import init_experiment, log_training_run
    from fairness.metrics import compute_fairness_metrics
    from mapie.classification import MapieClassifier

    if model_version is None:
        model_version = "v1.0.0"

    artifact_dir = Path(os.environ.get("MODEL_ARTIFACT_DIR", "./artifacts"))
    version_dir = artifact_dir / model_version
    version_dir.mkdir(parents=True, exist_ok=True)

    init_experiment("creditai")

    # 1. Load and preprocess
    df = _load_dataset()
    target_col = "target"
    if target_col not in df.columns:
        logger.error("No target column found — aborting training")
        return {"status": "error", "message": "No target column"}

    df = impute(df)
    df = encode_categoricals(df, target_col)

    feature_cols = [
        c for c in df.select_dtypes(include=[np.number]).columns
        if c not in [target_col, "probability_of_default"]
    ]
    X_all = df[feature_cols].values
    y_all = df[target_col].values.astype(int)

    # 2. OOT split
    oot = OutOfTimeValidator(n_splits=5, oot_fraction=0.20)
    X_dev, y_dev, X_oot, y_oot = oot.split(X_all, y_all)

    # 3. SMOTE on dev set only
    X_dev, y_dev = apply_smote(X_dev, y_dev)

    # Calibration split for MAPIE (last 20% of dev)
    calib_start = int(len(X_dev) * 0.80)
    X_calib, y_calib = X_dev[calib_start:], y_dev[calib_start:]
    X_train, y_train = X_dev[:calib_start], y_dev[:calib_start]

    # 4. Train models
    candidates: dict[str, Any] = {}

    lr = LogisticModel()
    lr.fit(X_train, y_train)
    candidates["logistic"] = lr

    xgb = XGBoostModel(n_trials=50)
    xgb.fit(X_train, y_train)
    candidates["xgboost"] = xgb

    lgb = LightGBMModel(n_trials=50)
    lgb.fit(X_train, y_train)
    candidates["lightgbm"] = lgb

    ebm = EBMExplainer()
    ebm.fit(X_train, y_train, feature_names=feature_cols)
    candidates["ebm"] = ebm

    # 5. Evaluate all and select best passing fairness
    best_model = None
    best_auc = -1.0
    best_metrics: dict[str, float] = {}

    # Create synthetic sensitive feature for fairness eval
    sensitive = pd.Series((y_oot + np.random.randint(0, 2, len(y_oot))) % 2)

    for name, model in candidates.items():
        try:
            metrics = evaluate_model(model, X_oot, y_oot)
            y_pred_oot = model.predict(X_oot)
            fairness = compute_fairness_metrics(
                y_oot, y_pred_oot, sensitive, model_version
            )
            metrics["fairness_passed"] = float(fairness["passed"])
            log_training_run(name, {}, metrics, model_version=model_version)

            if metrics["auc_roc"] > best_auc and fairness["passed"]:
                best_auc = metrics["auc_roc"]
                best_model = model
                best_metrics = metrics
        except Exception as e:
            logger.warning(f"Evaluation failed for {name}: {e}")

    if best_model is None:
        best_model = candidates.get("xgboost") or next(iter(candidates.values()))
        best_metrics = evaluate_model(best_model, X_oot, y_oot)

    # 6. Conformal prediction using MapieClassifier (classification, NOT regression)
    try:
        mapie = MapieClassifier(
            estimator=best_model._model if hasattr(best_model, "_model") else best_model,
            method="score",
            cv="prefit",
        )
        mapie.fit(X_calib, y_calib)
        y_pred_mapie, y_ps = mapie.predict(X_oot, alpha=0.05, include_last_label=True)
        # y_ps shape: (n_samples, n_classes, n_alpha)
        confidence_lower = y_ps[:, 1, 0].astype(float)
        confidence_upper = y_ps[:, 1, -1].astype(float)
        best_metrics["avg_confidence_lower"] = float(confidence_lower.mean())
        best_metrics["avg_confidence_upper"] = float(confidence_upper.mean())
    except Exception as e:
        logger.warning(f"Conformal prediction failed: {e}")

    # 7. Export to ONNX
    try:
        _export_onnx(best_model, X_train, version_dir, feature_cols)
    except Exception as e:
        logger.warning(f"ONNX export failed: {e}")

    logger.info(
        f"Training complete. Best AUC: {best_metrics.get('auc_roc', 0):.4f} | "
        f"Model version: {model_version}"
    )
    return {
        "status": "completed",
        "model_version": model_version,
        "metrics": best_metrics,
    }


def _export_onnx(model, X_sample: np.ndarray, version_dir: Path, feature_names: list) -> None:
    """Export sklearn-compatible model to ONNX."""
    from skl2onnx import convert_sklearn
    from skl2onnx.common.data_types import FloatTensorType

    inner = getattr(model, "_model", model)
    n_features = X_sample.shape[1]
    initial_type = [("float_input", FloatTensorType([None, n_features]))]
    onnx_model = convert_sklearn(inner, initial_types=initial_type)
    onnx_path = version_dir / "model.onnx"
    with open(onnx_path, "wb") as f:
        f.write(onnx_model.SerializeToString())
    logger.info(f"ONNX model saved to {onnx_path}")
