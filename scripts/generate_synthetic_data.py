"""
CreditAI — Synthetic Credit Data Generator
Generates realistic credit application data for model training and testing.

Usage:
  python scripts/generate_synthetic_data.py --n 5000 --seed 42
"""

import argparse
import numpy as np
import pandas as pd
from pathlib import Path


def generate(n: int, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    df = pd.DataFrame({
        "payment_history_pct": np.clip(rng.normal(85, 12, n), 0, 100).round(2),
        "amounts_owed": np.clip(rng.lognormal(9, 1.2, n), 500, 200000).round(2),
        "credit_utilization_ratio": np.clip(rng.beta(2, 5, n) * 100, 1, 99).round(2),
        "credit_length_months": rng.integers(6, 360, n),
        "new_inquiries_6m": rng.poisson(1.5, n).clip(0, 10),
        "credit_mix_count": rng.integers(1, 10, n),
        "annual_income": np.clip(rng.lognormal(10.8, 0.7, n), 15000, 500000).round(2),
        "age": rng.integers(18, 75, n),
        "employment_status": rng.choice(
            ["employed", "self-employed", "unemployed", "retired", "student"],
            n, p=[0.55, 0.15, 0.10, 0.12, 0.08],
        ),
        "zip_code": [str(z) for z in rng.integers(10000, 99999, n)],
        "mobile_usage_score": np.clip(rng.normal(60, 20, n), 0, 100).round(2),
        "utility_payment_ratio": np.clip(rng.normal(85, 10, n), 40, 100).round(2),
        "rental_history_months": rng.integers(0, 120, n),
        "digital_payment_frequency": np.clip(rng.exponential(12, n), 0, 80).round(1),
        "gender": rng.choice(["male", "female", "non-binary"], n, p=[0.48, 0.48, 0.04]),
        "region_type": rng.choice(["urban", "suburban", "rural"], n, p=[0.40, 0.35, 0.25]),
    })

    # Composite risk score (higher = lower default risk)
    risk_score = (
        0.30 * df["payment_history_pct"] / 100
        + 0.20 * (1 - df["credit_utilization_ratio"] / 100)
        + 0.15 * np.minimum(df["credit_length_months"] / 120, 1)
        + 0.10 * (1 - df["new_inquiries_6m"] / 10)
        + 0.10 * np.minimum(df["annual_income"] / 200000, 1)
        + 0.05 * df["mobile_usage_score"] / 100
        + 0.05 * df["utility_payment_ratio"] / 100
        + 0.05 * df["credit_mix_count"] / 10
    )

    # Add noise and threshold for default label
    noise = rng.normal(0, 0.05, n)
    df["default"] = ((risk_score + noise) < 0.45).astype(int)

    # Generate credit scores (300-850 range)
    df["credit_score"] = np.clip(
        300 + (risk_score * 550 + rng.normal(0, 25, n)),
        300, 850,
    ).astype(int)

    print(f"  Default rate: {df['default'].mean():.1%}")
    print(f"  Mean credit score: {df['credit_score'].mean():.0f}")
    print(f"  Score range: {df['credit_score'].min()} – {df['credit_score'].max()}")

    return df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic credit data")
    parser.add_argument("--n", type=int, default=5000, help="Number of samples")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()

    out_dir = Path("data/processed")
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Generating {args.n} synthetic credit records (seed={args.seed})...")
    df = generate(args.n, args.seed)

    parquet_path = out_dir / "synthetic_credit.parquet"
    csv_path = out_dir / "synthetic_credit.csv"
    df.to_parquet(parquet_path, index=False)
    df.to_csv(csv_path, index=False)

    print(f"\n✓ Saved {len(df)} samples:")
    print(f"  {parquet_path}")
    print(f"  {csv_path}")
