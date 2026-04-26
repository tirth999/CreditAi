import logging
import numpy as np
from typing import Any

logger = logging.getLogger(__name__)


class EBMExplainer:
    """InterpretML Explainable Boosting Machine — global and local explanations."""

    def __init__(self):
        self._ebm = None
        self._available = False
        try:
            from interpret.glassbox import ExplainableBoostingClassifier
            self._available = True
        except Exception as e:
            logger.warning(f"InterpretML not available: {e}")

    def fit(self, X: np.ndarray, y: np.ndarray, feature_names: list[str] | None = None):
        if not self._available:
            return self
        try:
            from interpret.glassbox import ExplainableBoostingClassifier
            self._ebm = ExplainableBoostingClassifier(
                feature_names=feature_names,
                random_state=42,
                n_jobs=-1,
            )
            self._ebm.fit(X, y)
        except Exception as e:
            logger.warning(f"EBM fit failed: {e}")
        return self

    def global_explanation(self) -> dict:
        if self._ebm is None:
            return {"scores": [], "names": []}
        try:
            from interpret import show
            exp = self._ebm.explain_global()
            data = exp.data()
            return {
                "names": list(data.get("names", [])),
                "scores": [float(s) for s in data.get("scores", [])],
            }
        except Exception as e:
            logger.warning(f"EBM global explanation failed: {e}")
            return {"scores": [], "names": []}

    def local_explanation(self, x: np.ndarray) -> dict:
        if self._ebm is None:
            return {"scores": [], "names": []}
        try:
            exp = self._ebm.explain_local(x.reshape(1, -1))
            data = exp.data(0)
            return {
                "names": list(data.get("names", [])),
                "scores": [float(s) for s in data.get("scores", [])],
                "intercept": float(data.get("extra", {}).get("names", [0.0])[0]),
            }
        except Exception as e:
            logger.warning(f"EBM local explanation failed: {e}")
            return {"scores": [], "names": []}

    def predict_proba(self, X: np.ndarray) -> np.ndarray | None:
        if self._ebm is None:
            return None
        try:
            return self._ebm.predict_proba(X)
        except Exception:
            return None
