import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

try:
    from aif360.datasets import BinaryLabelDataset
    from aif360.algorithms.preprocessing import Reweighing
    from aif360.algorithms.postprocessing import EqOddsPostprocessing
    AIF360_AVAILABLE = True
except Exception:
    AIF360_AVAILABLE = False


def apply_reweighing(
    X: np.ndarray,
    y: np.ndarray,
    sensitive: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Apply aif360 Reweighing to pre-process training data.
    Returns (X, y, sample_weights). Falls back to uniform weights if unavailable.
    """
    if not AIF360_AVAILABLE:
        logger.debug("aif360 not available — returning uniform sample weights")
        return X, y, np.ones(len(y))

    try:
        df = pd.DataFrame(X, columns=[f"f{i}" for i in range(X.shape[1])])
        df["label"] = y
        df["sensitive"] = sensitive

        dataset = BinaryLabelDataset(
            df=df,
            label_names=["label"],
            protected_attribute_names=["sensitive"],
        )
        rw = Reweighing(
            unprivileged_groups=[{"sensitive": 0}],
            privileged_groups=[{"sensitive": 1}],
        )
        dataset_rw = rw.fit_transform(dataset)
        return X, y, dataset_rw.instance_weights
    except Exception as e:
        logger.warning(f"aif360 Reweighing failed: {e} — using uniform weights")
        return X, y, np.ones(len(y))


def apply_eq_odds_postprocessing(
    y_pred_prob: np.ndarray,
    y_true: np.ndarray,
    sensitive: np.ndarray,
    threshold: float = 0.5,
) -> np.ndarray:
    """
    Apply aif360 EqOddsPostprocessing to calibrate thresholds per group.
    Returns adjusted binary predictions. Falls back to simple threshold if unavailable.
    """
    if not AIF360_AVAILABLE:
        return (y_pred_prob >= threshold).astype(int)

    try:
        y_pred = (y_pred_prob >= threshold).astype(int)

        def _make_dataset(y: np.ndarray, sens: np.ndarray) -> "BinaryLabelDataset":
            df = pd.DataFrame({"label": y, "sensitive": sens})
            return BinaryLabelDataset(
                df=df,
                label_names=["label"],
                protected_attribute_names=["sensitive"],
            )

        true_ds = _make_dataset(y_true, sensitive)
        pred_ds = _make_dataset(y_pred, sensitive)

        eqodds = EqOddsPostprocessing(
            unprivileged_groups=[{"sensitive": 0}],
            privileged_groups=[{"sensitive": 1}],
            seed=42,
        )
        eqodds.fit(true_ds, pred_ds)
        pred_ds_adjusted = eqodds.predict(pred_ds)
        return pred_ds_adjusted.labels.ravel().astype(int)
    except Exception as e:
        logger.warning(f"aif360 EqOddsPostprocessing failed: {e} — using threshold")
        return (y_pred_prob >= threshold).astype(int)
