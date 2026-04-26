import numpy as np
from sklearn.model_selection import TimeSeriesSplit


class OutOfTimeValidator:
    """
    TimeSeriesSplit CV wrapper with held-out most-recent 20% as OOT test set.
    """

    def __init__(self, n_splits: int = 5, oot_fraction: float = 0.20):
        self.n_splits = n_splits
        self.oot_fraction = oot_fraction
        self._tscv = TimeSeriesSplit(n_splits=n_splits)

    def split(
        self, X: np.ndarray, y: np.ndarray
    ) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Returns (X_dev, y_dev, X_oot, y_oot).
        X_dev = first 80%, X_oot = last 20% (out-of-time).
        """
        n = len(X)
        oot_start = int(n * (1 - self.oot_fraction))
        X_dev, y_dev = X[:oot_start], y[:oot_start]
        X_oot, y_oot = X[oot_start:], y[oot_start:]
        return X_dev, y_dev, X_oot, y_oot

    def cv_splits(self, X: np.ndarray, y: np.ndarray):
        """Yield (train_idx, val_idx) pairs from TimeSeriesSplit on dev set."""
        X_dev, y_dev, _, _ = self.split(X, y)
        for train_idx, val_idx in self._tscv.split(X_dev):
            yield train_idx, val_idx
