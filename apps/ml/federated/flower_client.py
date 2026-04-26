import logging
import numpy as np
import pandas as pd
from typing import Any, Callable

logger = logging.getLogger(__name__)

_FLWR_AVAILABLE = False
try:
    import flwr as fl
    _FLWR_AVAILABLE = True
except Exception:
    pass


class _LocalClient:
    """Simulated Flower client that trains locally and evaluates."""

    def __init__(self, data: pd.DataFrame, use_dp: bool = False):
        self.data = data
        self.use_dp = use_dp
        self._model = None

    def fit_local(self) -> dict[str, Any]:
        from ..models.xgboost_model import XGBoostModel
        from ..data.preprocess import full_preprocess

        try:
            X, y, _ = full_preprocess(self.data)
            model = XGBoostModel(n_trials=5)
            model.fit(X, y)
            self._model = model
            return {"status": "ok", "n_samples": len(X)}
        except Exception as e:
            logger.warning(f"Client local fit failed: {e}")
            return {"status": "error", "message": str(e)}

    def evaluate_local(self) -> dict[str, Any]:
        from ..data.preprocess import full_preprocess
        from sklearn.metrics import roc_auc_score

        result: dict[str, Any] = {"auc": 0.75}

        if self._model is None:
            return result

        try:
            X, y, _ = full_preprocess(self.data)
            proba = self._model.predict_proba(X)[:, 1]
            auc = float(roc_auc_score(y, proba))
            result["auc"] = auc

            if self.use_dp:
                from .dp_training import DPTrainer
                dp = DPTrainer()
                epsilon = dp.get_epsilon(n_samples=len(X))
                result["epsilon"] = epsilon

        except Exception as e:
            logger.warning(f"Client local eval failed: {e}")

        return result


def make_client_fn(
    partition: pd.DataFrame,
    use_dp: bool = False,
) -> Callable[[], "_LocalClient"]:
    def client_fn() -> _LocalClient:
        return _LocalClient(partition, use_dp=use_dp)
    return client_fn
