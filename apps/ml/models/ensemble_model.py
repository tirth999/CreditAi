from __future__ import annotations
import numpy as np
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from .base_model import BaseModel
from .xgboost_model import XGBoostModel
from .lightgbm_model import LightGBMModel
from .logistic_model import LogisticModel


class EnsembleModel(BaseModel):
    """Stacking ensemble: XGBoost + LightGBM + LogisticRegression → LogReg meta-learner."""

    def __init__(self, n_trials: int = 20):
        self.n_trials = n_trials
        self._scaler = StandardScaler()
        self._xgb = XGBoostModel(n_trials=n_trials)
        self._lgb = LightGBMModel(n_trials=n_trials)
        self._lr = LogisticModel()
        self._stack: StackingClassifier | None = None

    def fit(self, X: np.ndarray, y: np.ndarray) -> "EnsembleModel":
        # Train base models first to get optimised estimators
        self._xgb.fit(X, y)
        self._lgb.fit(X, y)
        self._lr.fit(X, y)

        estimators = [
            ("xgb", self._xgb._model),
            ("lgb", self._lgb._model),
            ("lr", self._lr._model),
        ]
        meta = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
        self._stack = StackingClassifier(
            estimators=estimators,
            final_estimator=meta,
            cv=3,
            passthrough=False,
            n_jobs=-1,
        )
        self._stack.fit(X, y)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        assert self._stack is not None
        return self._stack.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        assert self._stack is not None
        return self._stack.predict_proba(X)

    def get_feature_importances(self) -> np.ndarray | None:
        # Average XGB + LGB importances
        xgb_imp = self._xgb.get_feature_importances()
        lgb_imp = self._lgb.get_feature_importances()
        if xgb_imp is not None and lgb_imp is not None:
            min_len = min(len(xgb_imp), len(lgb_imp))
            return (xgb_imp[:min_len] + lgb_imp[:min_len]) / 2
        return xgb_imp or lgb_imp
