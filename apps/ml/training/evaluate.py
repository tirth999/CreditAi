import logging
import numpy as np
from sklearn.metrics import roc_auc_score, f1_score, accuracy_score, brier_score_loss

logger = logging.getLogger(__name__)


def evaluate_model(
    model,
    X: np.ndarray,
    y: np.ndarray,
    threshold: float = 0.5,
) -> dict[str, float]:
    """
    Compute full evaluation suite: AUC-ROC, Gini, F1, Accuracy, Brier Score.
    """
    try:
        proba = model.predict_proba(X)[:, 1]
    except Exception:
        proba = model.predict(X).astype(float)

    y_pred = (proba >= threshold).astype(int)

    auc = float(roc_auc_score(y, proba))
    gini = float(2 * auc - 1)
    f1 = float(f1_score(y, y_pred, zero_division=0))
    acc = float(accuracy_score(y, y_pred))
    brier = float(brier_score_loss(y, proba))

    return {
        "auc_roc": auc,
        "gini_coefficient": gini,
        "f1_score": f1,
        "accuracy": acc,
        "brier_score": brier,
    }
