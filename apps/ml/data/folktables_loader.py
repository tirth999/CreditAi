import logging
import pandas as pd

logger = logging.getLogger(__name__)

_FOLKTABLES_AVAILABLE = False

try:
    from folktables import ACSDataSource, ACSIncome  # noqa: F401
    _FOLKTABLES_AVAILABLE = True
except Exception as _e:
    logger.warning(f"folktables not available: {_e}")


def load_acs_income(
    state: str = "CA",
    year: str = "2018",
) -> pd.DataFrame | None:
    if not _FOLKTABLES_AVAILABLE:
        return None
    try:
        from folktables import ACSDataSource, ACSIncome
        data_source = ACSDataSource(
            survey_year=year, horizon="1-Year", survey="person"
        )
        acs_data = data_source.get_data(states=[state], download=True)
        features, labels, _ = ACSIncome.df_to_numpy(acs_data)
        df = pd.DataFrame(features, columns=ACSIncome.features)
        df["target"] = labels.astype(int)
        return df
    except Exception as e:
        logger.error(f"folktables load failed: {e}")
        return None
