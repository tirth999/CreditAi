import logging
import numpy as np
from typing import Any

logger = logging.getLogger(__name__)


def explain(
    model: Any,
    X: np.ndarray,
    feature_names: list[str],
    background: np.ndarray | None = None,
) -> dict:
    """
    Compute SHAP values for the given model and input X.
    Uses TreeExplainer for XGBoost/LightGBM, KernelExplainer as fallback.
    Returns dict with base_value, shap_values, feature_names.
    """
    try:
        import shap

        # Try tree-based explainer first
        try:
            explainer = shap.TreeExplainer(model)
            shap_vals = explainer.shap_values(X)
            base_value = float(explainer.expected_value)

            # For binary classifiers: shap_vals may be [neg_class, pos_class]
            if isinstance(shap_vals, list) and len(shap_vals) == 2:
                sv = shap_vals[1]
            else:
                sv = shap_vals

            return {
                "base_value": base_value,
                "shap_values": sv.tolist() if hasattr(sv, "tolist") else sv,
                "feature_names": feature_names,
            }
        except Exception as tree_err:
            logger.debug(f"TreeExplainer failed ({tree_err}), trying KernelExplainer")

        # KernelExplainer fallback
        bg = background if background is not None else shap.sample(X, min(100, len(X)))

        def _predict_fn(x: np.ndarray) -> np.ndarray:
            if hasattr(model, "predict_proba"):
                return model.predict_proba(x)[:, 1]
            return model.predict(x).astype(float)

        explainer = shap.KernelExplainer(_predict_fn, bg)
        shap_vals = explainer.shap_values(X, nsamples=100)
        base_value = float(explainer.expected_value)

        return {
            "base_value": base_value,
            "shap_values": shap_vals.tolist() if hasattr(shap_vals, "tolist") else shap_vals,
            "feature_names": feature_names,
        }

    except Exception as e:
        logger.warning(f"SHAP explanation failed: {e}")
        n = len(X) if hasattr(X, "__len__") else 1
        return {
            "base_value": 0.0,
            "shap_values": [[0.0] * len(feature_names)] * n,
            "feature_names": feature_names,
        }


def explain_single(
    model: Any,
    x: np.ndarray,
    feature_names: list[str],
    background: np.ndarray | None = None,
) -> list[dict]:
    """
    Explain a single sample. Returns sorted list of feature dicts with shap_value,
    rank, and direction — ready to store in ShapValue model.
    """
    result = explain(model, x.reshape(1, -1), feature_names, background)
    sv = result["shap_values"]
    if sv and isinstance(sv[0], list):
        sv = sv[0]

    items = []
    for i, (name, val) in enumerate(zip(feature_names, sv)):
        items.append(
            {
                "feature_name": name,
                "feature_value": float(x[i]) if i < len(x) else None,
                "shap_value": float(val),
                "rank": 0,
                "direction": "positive" if float(val) >= 0 else "negative",
            }
        )
    items.sort(key=lambda d: abs(d["shap_value"]), reverse=True)
    for rank, item in enumerate(items, start=1):
        item["rank"] = rank
    return items
