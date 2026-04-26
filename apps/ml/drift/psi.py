import json
import logging
from pathlib import Path
import numpy as np

logger = logging.getLogger(__name__)

PSI_STABLE = 0.10
PSI_MODERATE = 0.20

EPS = 1e-10
N_BINS = 10


def compute_psi(
    expected: np.ndarray,
    actual: np.ndarray,
    n_bins: int = N_BINS,
    bin_edges: np.ndarray | None = None,
) -> tuple[float, np.ndarray]:
    """
    Compute Population Stability Index.
    Returns (psi_value, bin_edges).
    """
    expected = np.asarray(expected, dtype=float)
    actual = np.asarray(actual, dtype=float)

    if bin_edges is None:
        quantiles = np.linspace(0, 100, n_bins + 1)
        bin_edges = np.percentile(expected, quantiles)
        bin_edges = np.unique(bin_edges)

    def _bin_pct(arr: np.ndarray) -> np.ndarray:
        counts = np.histogram(arr, bins=bin_edges)[0].astype(float)
        counts = np.clip(counts, EPS, None)
        return counts / counts.sum()

    pct_expected = _bin_pct(expected)
    pct_actual = _bin_pct(actual)

    psi = float(
        np.sum((pct_actual - pct_expected) * np.log((pct_actual + EPS) / (pct_expected + EPS)))
    )
    return psi, bin_edges


def psi_interpretation(psi: float) -> str:
    if psi < PSI_STABLE:
        return "stable"
    if psi < PSI_MODERATE:
        return "moderate_shift"
    return "significant_drift"


def compute_all_psi(
    expected_df,
    actual_df,
    feature_cols: list[str],
    artifact_dir: str | None = None,
    model_version: str = "v1.0.0",
) -> dict[str, dict]:
    """
    Compute PSI for each feature. Saves bin edges to artifact_dir if provided.
    """
    results: dict[str, dict] = {}
    bin_store: dict[str, list] = {}

    for col in feature_cols:
        if col not in expected_df.columns or col not in actual_df.columns:
            continue
        try:
            psi_val, edges = compute_psi(
                expected_df[col].dropna().values,
                actual_df[col].dropna().values,
            )
            status = psi_interpretation(psi_val)
            results[col] = {"psi": psi_val, "status": status}
            bin_store[col] = edges.tolist()
        except Exception as e:
            logger.warning(f"PSI computation failed for {col}: {e}")
            results[col] = {"psi": 0.0, "status": "unknown"}

    if artifact_dir:
        path = Path(artifact_dir) / f"v{model_version}" / "psi_bins.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(bin_store, f)

    return results
