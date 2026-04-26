import numpy as np
import pandas as pd
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference

try:
    from aif360.datasets import BinaryLabelDataset
    from aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric
    AIF360_AVAILABLE = True
except Exception:
    AIF360_AVAILABLE = False


def compute_fairness_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    sensitive_features: pd.Series,
    model_version: str,
) -> dict:
    dpd = float(
        demographic_parity_difference(
            y_true, y_pred, sensitive_features=sensitive_features
        )
    )
    eod = float(
        equalized_odds_difference(
            y_true, y_pred, sensitive_features=sensitive_features
        )
    )

    groups = sensitive_features.unique()
    approval_rates: dict[str, float] = {}
    for g in groups:
        mask = sensitive_features == g
        approval_rates[str(g)] = float(y_pred[mask].mean())

    max_rate = max(approval_rates.values()) if approval_rates else 1.0
    min_rate = min(approval_rates.values()) if approval_rates else 1.0
    dir_val = (min_rate / max_rate) if max_rate > 0 else 1.0

    if AIF360_AVAILABLE:
        try:
            df = pd.DataFrame(
                {"label": y_true, "sensitive": sensitive_features.values}
            )
            dataset = BinaryLabelDataset(
                df=df,
                label_names=["label"],
                protected_attribute_names=["sensitive"],
            )
            metric = BinaryLabelDatasetMetric(
                dataset,
                privileged_groups=[{"sensitive": 1}],
                unprivileged_groups=[{"sensitive": 0}],
            )
            spd = float(metric.statistical_parity_difference())
            eqo = float(eod)
        except Exception:
            spd = float(dpd)
            eqo = float(eod)
    else:
        spd = float(dpd)
        eqo = float(eod)

    flags = {
        "dpd": dpd > 0.10,
        "eod": eod > 0.10,
        "dir": dir_val < 0.80,
    }

    return {
        "model_version": model_version,
        "demographic_parity_diff": dpd,
        "equalized_odds_diff": eod,
        "disparate_impact_ratio": dir_val,
        "statistical_parity_diff": spd,
        "equal_opportunity_diff": eqo,
        "approval_rates": approval_rates,
        "flags": flags,
        "passed": not any(flags.values()),
    }
