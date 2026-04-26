import logging
from pathlib import Path
import pandas as pd

logger = logging.getLogger(__name__)


def generate_drift_report(
    reference_df: pd.DataFrame,
    current_df: pd.DataFrame,
    output_dir: str = "./reports",
    report_name: str = "drift_report",
) -> dict:
    """
    Generate Evidently data drift report.
    Returns dict with drift_share and per-feature drift flags.
    Saves HTML and JSON to output_dir if generation succeeds.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    try:
        from evidently.report import Report
        from evidently.metric_preset import DataDriftPreset

        report = Report(metrics=[DataDriftPreset()])
        report.run(reference_data=reference_df, current_data=current_df)

        html_path = Path(output_dir) / f"{report_name}.html"
        json_path = Path(output_dir) / f"{report_name}.json"

        report.save_html(str(html_path))

        result_dict = report.as_dict()
        import json
        with open(json_path, "w") as f:
            json.dump(result_dict, f, indent=2, default=str)

        # Extract summary
        metrics = result_dict.get("metrics", [])
        drift_share = 0.0
        feature_drift: dict[str, bool] = {}

        for m in metrics:
            if m.get("metric") == "DatasetDriftMetric":
                drift_share = m.get("result", {}).get("drift_share", 0.0)
            elif m.get("metric") == "ColumnDriftMetric":
                col = m.get("result", {}).get("column_name", "unknown")
                feature_drift[col] = m.get("result", {}).get("drift_detected", False)

        return {
            "drift_share": float(drift_share),
            "feature_drift": feature_drift,
            "html_path": str(html_path),
            "json_path": str(json_path),
        }

    except Exception as e:
        logger.warning(f"Evidently drift report failed: {e}")
        return {
            "drift_share": 0.0,
            "feature_drift": {},
            "html_path": None,
            "json_path": None,
        }
