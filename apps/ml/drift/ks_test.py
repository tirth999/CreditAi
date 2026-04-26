import logging
import numpy as np
from scipy import stats

logger = logging.getLogger(__name__)


def ks_test(
    reference: np.ndarray,
    current: np.ndarray,
) -> dict[str, float]:
    """
    Two-sample Kolmogorov-Smirnov test.
    Returns {'statistic': float, 'p_value': float, 'drift_detected': bool}.
    """
    try:
        reference = np.asarray(reference, dtype=float)
        current = np.asarray(current, dtype=float)
        result = stats.ks_2samp(reference, current)
        return {
            "statistic": float(result.statistic),
            "p_value": float(result.pvalue),
            "drift_detected": float(result.pvalue) < 0.05,
        }
    except Exception as e:
        logger.warning(f"KS test failed: {e}")
        return {"statistic": 0.0, "p_value": 1.0, "drift_detected": False}


def ks_test_all_features(
    reference_df,
    current_df,
    feature_cols: list[str],
) -> dict[str, dict[str, float]]:
    """Run KS test for every feature column. Returns dict of feature -> result."""
    results: dict[str, dict[str, float]] = {}
    for col in feature_cols:
        if col in reference_df.columns and col in current_df.columns:
            results[col] = ks_test(
                reference_df[col].dropna().values,
                current_df[col].dropna().values,
            )
    return results
