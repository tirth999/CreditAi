import logging
import numpy as np
from typing import Any

logger = logging.getLogger(__name__)


def explain_lime(
    model: Any,
    x: np.ndarray,
    X_train: np.ndarray,
    feature_names: list[str],
    num_features: int = 10,
    num_samples: int = 1000,
) -> list[dict]:
    """
    LIME tabular explanation for a single sample.
    Returns list of {feature_name, lime_value, rank} dicts sorted by |lime_value|.
    """
    try:
        from lime.lime_tabular import LimeTabularExplainer

        def _predict_fn(x_arr: np.ndarray) -> np.ndarray:
            if hasattr(model, "predict_proba"):
                return model.predict_proba(x_arr)
            preds = model.predict(x_arr).astype(float)
            return np.column_stack([1 - preds, preds])

        explainer = LimeTabularExplainer(
            training_data=X_train,
            feature_names=feature_names,
            class_names=["no_default", "default"],
            mode="classification",
            random_state=42,
        )
        explanation = explainer.explain_instance(
            x,
            _predict_fn,
            num_features=num_features,
            num_samples=num_samples,
            labels=(1,),
        )
        raw = explanation.as_list(label=1)
        items = [
            {
                "feature_name": feat,
                "lime_value": float(val),
                "rank": rank + 1,
            }
            for rank, (feat, val) in enumerate(
                sorted(raw, key=lambda t: abs(t[1]), reverse=True)
            )
        ]
        return items

    except Exception as e:
        logger.warning(f"LIME explanation failed: {e}")
        return [
            {"feature_name": n, "lime_value": 0.0, "rank": i + 1}
            for i, n in enumerate(feature_names[:num_features])
        ]
