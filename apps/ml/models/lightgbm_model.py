from __future__ import annotations
import numpy as np
import optuna
from lightgbm import LGBMClassifier
from sklearn.model_selection import cross_val_score
from .base_model import BaseModel

optuna.logging.set_verbosity(optuna.logging.WARNING)


class LightGBMModel(BaseModel):
    def __init__(self, n_trials: int = 50):
        self.n_trials = n_trials
        self._model: LGBMClassifier | None = None
        self.best_params: dict = {}

    def _objective(self, trial: optuna.Trial, X: np.ndarray, y: np.ndarray) -> float:
        params = {
            "n_estimators": trial.suggest_int("n_estimators", 50, 500),
            "max_depth": trial.suggest_int("max_depth", 3, 12),
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
            "num_leaves": trial.suggest_int("num_leaves", 20, 150),
            "subsample": trial.suggest_float("subsample", 0.6, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
            "reg_alpha": trial.suggest_float("reg_alpha", 1e-8, 1.0, log=True),
            "reg_lambda": trial.suggest_float("reg_lambda", 1e-8, 1.0, log=True),
            "min_child_samples": trial.suggest_int("min_child_samples", 5, 100),
            "random_state": 42,
            "verbosity": -1,
        }
        model = LGBMClassifier(**params)
        scores = cross_val_score(model, X, y, cv=3, scoring="roc_auc", n_jobs=-1)
        return float(scores.mean())

    def fit(self, X: np.ndarray, y: np.ndarray) -> "LightGBMModel":
        study = optuna.create_study(direction="maximize")
        study.optimize(
            lambda trial: self._objective(trial, X, y),
            n_trials=self.n_trials,
            show_progress_bar=False,
        )
        self.best_params = study.best_params
        self.best_params["random_state"] = 42
        self.best_params["verbosity"] = -1
        self._model = LGBMClassifier(**self.best_params)
        self._model.fit(X, y)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        assert self._model is not None
        return self._model.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        assert self._model is not None
        return self._model.predict_proba(X)

    def get_feature_importances(self) -> np.ndarray | None:
        if self._model is not None:
            return self._model.feature_importances_
        return None
