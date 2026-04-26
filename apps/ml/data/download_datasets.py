import os
import logging
import requests
import numpy as np
import pandas as pd
from pathlib import Path

from .synthetic_gen import generate_full_dataset
from ..core.config import ml_settings

logger = logging.getLogger(__name__)

DATA_DIR = Path("data/processed")
DATA_DIR.mkdir(parents=True, exist_ok=True)

_german_df: pd.DataFrame | None = None


def _download_uci_german() -> pd.DataFrame | None:
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/statlog/german/german.data"
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        cols = [f"f{i}" for i in range(20)] + ["target"]
        from io import StringIO
        df = pd.read_csv(StringIO(resp.text), sep=" ", header=None, names=cols)
        df["target"] = (df["target"] == 2).astype(int)
        df.to_parquet(DATA_DIR / "german_credit.parquet", index=False)
        print(f"UCI German Credit: {len(df)} samples")
        return df
    except Exception as e:
        print(f"UCI German Credit failed: {e}")
        return None


def _download_uci_australian() -> pd.DataFrame | None:
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/statlog/australian/australian.dat"
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        from io import StringIO
        cols = [f"f{i}" for i in range(14)] + ["target"]
        df = pd.read_csv(StringIO(resp.text), sep=" ", header=None, names=cols)
        df.to_parquet(DATA_DIR / "australian_credit.parquet", index=False)
        print(f"UCI Australian Credit: {len(df)} samples")
        return df
    except Exception as e:
        print(f"UCI Australian Credit failed: {e}")
        return None


def _download_kaggle_give_me_some_credit() -> None:
    try:
        import kaggle
        os.environ["KAGGLE_USERNAME"] = ml_settings.KAGGLE_USERNAME
        os.environ["KAGGLE_KEY"] = ml_settings.KAGGLE_KEY
        kaggle.api.authenticate()
        kaggle.api.competition_download_files(
            "GiveMeSomeCredit", path=str(DATA_DIR), quiet=False
        )
        print("Kaggle GiveMeSomeCredit: downloaded")
    except Exception as e:
        print(f"Kaggle GiveMeSomeCredit unavailable, skipping: {e}")


def _download_kaggle_home_credit() -> None:
    try:
        import kaggle
        os.environ["KAGGLE_USERNAME"] = ml_settings.KAGGLE_USERNAME
        os.environ["KAGGLE_KEY"] = ml_settings.KAGGLE_KEY
        kaggle.api.authenticate()
        kaggle.api.competition_download_file(
            "home-credit-default-risk",
            "application_train.csv",
            path=str(DATA_DIR),
            quiet=False,
        )
        print("Kaggle Home Credit Default Risk: downloaded")
    except Exception as e:
        print(f"Kaggle Home Credit unavailable, skipping: {e}")


def _download_folktables() -> pd.DataFrame | None:
    try:
        from folktables import ACSDataSource, ACSIncome
        data_source = ACSDataSource(survey_year="2018", horizon="1-Year", survey="person")
        acs_data = data_source.get_data(states=["CA"], download=True)
        features, labels, _ = ACSIncome.df_to_numpy(acs_data)
        df = pd.DataFrame(features, columns=ACSIncome.features)
        df["target"] = labels.astype(int)
        df.to_parquet(DATA_DIR / "folktables_acs.parquet", index=False)
        print(f"folktables ACSIncome CA 2018: {len(df)} samples")
        return df
    except Exception as e:
        print(f"folktables failed: {e}")
        return None


def _generate_synthetic(base_df: pd.DataFrame | None = None) -> None:
    try:
        synth = generate_full_dataset(5000)
        synth.to_parquet(DATA_DIR / "synthetic_credit.parquet", index=False)
        print(f"SDV synthetic: {len(synth)} samples generated")
    except Exception as e:
        print(f"SDV synthetic generation failed: {e}")


def run_downloads() -> None:
    global _german_df
    _german_df = _download_uci_german()
    _download_uci_australian()
    _download_kaggle_give_me_some_credit()
    _download_kaggle_home_credit()
    _download_folktables()
    _generate_synthetic(_german_df)


if __name__ == "__main__":
    run_downloads()
