from abc import ABC, abstractmethod
import numpy as np
import pandas as pd


class BaseModel(ABC):
    """Abstract base class for all CreditAI ML models."""

    @abstractmethod
    def fit(self, X: np.ndarray, y: np.ndarray) -> "BaseModel":
        """Fit the model on training data."""
        ...

    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return binary predictions (0/1)."""
        ...

    @abstractmethod
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Return probability estimates shape (n_samples, 2)."""
        ...

    @abstractmethod
    def get_feature_importances(self) -> np.ndarray | None:
        """Return feature importance array or None if not applicable."""
        ...
