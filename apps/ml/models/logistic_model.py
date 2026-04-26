import numpy as np
from sklearn.linear_model import LogisticRegression as SKLogisticRegression
from sklearn.preprocessing import StandardScaler
from .base_model import BaseModel


class LogisticModel(BaseModel):
    def __init__(self, C: float = 1.0, max_iter: int = 1000):
        self.C = C
        self.max_iter = max_iter
        self._scaler = StandardScaler()
        self._model = SKLogisticRegression(
            C=C, max_iter=max_iter, solver="lbfgs", random_state=42
        )

    def fit(self, X: np.ndarray, y: np.ndarray) -> "LogisticModel":
        X_scaled = self._scaler.fit_transform(X)
        self._model.fit(X_scaled, y)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self._model.predict(self._scaler.transform(X))

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        return self._model.predict_proba(self._scaler.transform(X))

    def get_feature_importances(self) -> np.ndarray | None:
        if hasattr(self._model, "coef_"):
            return np.abs(self._model.coef_[0])
        return None
