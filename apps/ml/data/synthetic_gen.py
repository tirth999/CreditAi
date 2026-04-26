import random
import numpy as np
import pandas as pd

FEATURE_SCHEMA = {
    "payment_history_pct": (0.60, 1.0),
    "amounts_owed": (0.0, 50000.0),
    "credit_utilization_ratio": (0.0, 1.0),
    "credit_length_months": (6, 300),
    "new_inquiries_6m": (0, 10),
    "credit_mix_count": (1, 8),
    "annual_income": (15000.0, 250000.0),
    "age": (18, 80),
    "mobile_usage_score": (0.0, 1.0),
    "utility_payment_ratio": (0.0, 1.0),
    "rental_history_months": (0, 120),
    "digital_payment_frequency": (0.0, 1.0),
}

EMPLOYMENT_STATUS = ["employed", "self-employed", "unemployed", "retired", "student"]
ZIP_CODES = ["10001", "94102", "60601", "77001", "85001", "30301", "98101", "02101"]


def _generate_row(rng: np.random.Generator) -> dict:
    row = {}
    for feat, (lo, hi) in FEATURE_SCHEMA.items():
        if isinstance(lo, int):
            row[feat] = int(rng.integers(lo, hi + 1))
        else:
            row[feat] = float(rng.uniform(lo, hi))

    row["employment_status"] = rng.choice(EMPLOYMENT_STATUS)
    row["zip_code"] = rng.choice(ZIP_CODES)
    row["has_alt_data"] = bool(rng.integers(0, 2))

    # synthetic label: high utilisation + low payment history -> higher default risk
    default_prob = (
        0.3
        + 0.4 * row["credit_utilization_ratio"]
        - 0.4 * row["payment_history_pct"]
        + 0.05 * row["new_inquiries_6m"]
    )
    default_prob = float(np.clip(default_prob, 0.02, 0.98))
    row["target"] = int(rng.random() < default_prob)
    row["probability_of_default"] = round(default_prob, 4)
    return row


def generate_full_dataset(n: int = 5000) -> pd.DataFrame:
    rng = np.random.default_rng(seed=42)
    rows = [_generate_row(rng) for _ in range(n)]
    return pd.DataFrame(rows)


def generate_demo_application() -> dict:
    rng = np.random.default_rng(seed=None)
    row = _generate_row(rng)
    row.pop("target", None)
    row["financial_narrative_text"] = (
        "I have been consistently employed for the past five years "
        "and have maintained low outstanding balances on all accounts."
    )
    row["demographic_consented"] = False
    return row
