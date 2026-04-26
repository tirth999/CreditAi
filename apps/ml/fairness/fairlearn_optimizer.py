import logging
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

logger = logging.getLogger(__name__)


def threshold_optimizer(
    estimator,
    X_train: np.ndarray,
    y_train: np.ndarray,
    sensitive_train: pd.Series,
    X_test: np.ndarray,
    sensitive_test: pd.Series,
    constraint: str = "demographic_parity",
) -> np.ndarray:
    """
    Apply fairlearn ThresholdOptimizer to reduce demographic parity or equalized odds gap.
    Returns adjusted predictions on X_test.
    """
    try:
        from fairlearn.postprocessing import ThresholdOptimizer
        from fairlearn.reductions import DemographicParity, EqualizedOdds

        constraint_map = {
            "demographic_parity": DemographicParity(),
            "equalized_odds": EqualizedOdds(),
        }
        fairness_constraint = constraint_map.get(constraint, DemographicParity())

        optimizer = ThresholdOptimizer(
            estimator=estimator,
            constraints=fairness_constraint,
            predict_method="predict_proba",
            objective="balanced_accuracy_score",
        )
        optimizer.fit(X_train, y_train, sensitive_features=sensitive_train)
        return optimizer.predict(X_test, sensitive_features=sensitive_test)
    except Exception as e:
        logger.warning(f"ThresholdOptimizer failed: {e}")
        if hasattr(estimator, "predict"):
            return estimator.predict(X_test)
        return np.zeros(len(X_test), dtype=int)


def exponentiated_gradient(
    X_train: np.ndarray,
    y_train: np.ndarray,
    sensitive_train: pd.Series,
    constraint: str = "demographic_parity",
    eps: float = 0.01,
) -> object:
    """
    Train a fairness-constrained classifier using fairlearn ExponentiatedGradient.
    Returns the trained mitigator object.
    """
    try:
        from fairlearn.reductions import ExponentiatedGradient, DemographicParity, EqualizedOdds

        constraint_map = {
            "demographic_parity": DemographicParity(difference_bound=eps),
            "equalized_odds": EqualizedOdds(difference_bound=eps),
        }
        fairness_constraint = constraint_map.get(
            constraint, DemographicParity(difference_bound=eps)
        )
        base = LogisticRegression(C=1.0, max_iter=1000, random_state=42, solver="lbfgs")
        mitigator = ExponentiatedGradient(base, constraints=fairness_constraint)
        mitigator.fit(X_train, y_train, sensitive_features=sensitive_train)
        return mitigator
    except Exception as e:
        logger.warning(f"ExponentiatedGradient failed: {e}")
        base = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
        base.fit(X_train, y_train)
        return base
