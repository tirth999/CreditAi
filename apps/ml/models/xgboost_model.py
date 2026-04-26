import numpy as np
import optuna
from xgboost import XGBClassifier
from sklearn.model_selection import cross_val_score
from .base_model import BaseModel

optuna.logging.set_verbosity(optuna.logging.WARNING)


class XGBoostModel(BaseModel):
    def __init__(self, n_trials: int = 50):
        self.n_trials = n_trials
        self._model: XGBClassifier | None = None
        self.best_params: dict = {}

    def _objective(self, trial: optuna.Trial, X: np.ndarray, y: np.ndarray) -> float:
        params = {
            "n_estimators": trial.suggest_int("n_estimators", 50, 500),
            "max_depth": trial.suggest_int("max_depth", 3, 10),
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
            "subsample": trial.suggest_float("subsample", 0.6, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
            "min_child_weight": trial.suggest_int("min_child_weight", 1, 10),
            "reg_alpha": trial.suggest_float("reg_alpha", 1e-8, 1.0, log=True),
            "reg_lambda": trial.suggest_float("reg_lambda", 1e-8, 1.0, log=True),
            "objective": "binary:logistic",
            "eval_metric": "auc",
            "use_label_encoder": False,
            "random_state": 42,
            "tree_method": "hist",
        }
        model = XGBClassifier(**params)
        scores = cross_val_score(model, X, y, cv=3, scoring="roc_auc", n_jobs=-1)
        return float(scores.mean())

    def fit(self, X: np.ndarray, y: np.ndarray) -> "XGBoostModel":
        study = optuna.create_study(direction="maximize")
        study.optimize(
            lambda trial: self._objective(trial, X, y),
            n_trials=self.n_trials,
            show_progress_bar=False,
        )
        self.best_params = study.best_params
        self.best_params.update(
            {
                "objective": "binary:logistic",
                "eval_metric": "auc",
                "use_label_encoder": False,
                "random_state": 42,
                "tree_method": "hist",
            }
        )
        self._model = XGBClassifier(**self.best_params)
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
