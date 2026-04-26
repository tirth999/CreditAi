import numpy as np
import pandas as pd

ALT_FEATURE_RANGES = {
    "mobile_usage_score": (0.0, 1.0),
    "utility_payment_ratio": (0.0, 1.0),
    "rental_history_months": (0, 120),
    "digital_payment_frequency": (0.0, 1.0),
}


def normalize(value: float, lo: float, hi: float) -> float:
    if hi == lo:
        return 0.5
    return float(np.clip((value - lo) / (hi - lo), 0.0, 1.0))


def transform_alt_features(data: dict) -> dict:
    """
    Normalize raw alternative data fields to [0, 1] and compute a composite
    alt_data_score that can be appended to the model feature vector.
    """
    out: dict = {}

    for feat, (lo, hi) in ALT_FEATURE_RANGES.items():
        raw = data.get(feat)
        if raw is not None:
            out[f"{feat}_norm"] = normalize(float(raw), float(lo), float(hi))
        else:
            out[f"{feat}_norm"] = 0.5  # neutral imputation

    # composite: higher score = lower risk
    weights = {
        "utility_payment_ratio_norm": 0.40,
        "rental_history_months_norm": 0.25,
        "digital_payment_frequency_norm": 0.20,
        "mobile_usage_score_norm": 0.15,
    }
    composite = sum(out.get(k, 0.5) * w for k, w in weights.items())
    out["alt_data_composite_score"] = round(composite, 4)

    # risk signal: 1 - composite (higher composite = lower default risk)
    out["alt_data_risk_signal"] = round(1.0 - composite, 4)

    return out


def alt_features_to_vector(data: dict) -> np.ndarray:
    transformed = transform_alt_features(data)
    keys = sorted(transformed.keys())
    return np.array([transformed[k] for k in keys], dtype=np.float32)
