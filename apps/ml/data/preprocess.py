import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import TimeSeriesSplit

try:
    from imblearn.over_sampling import SMOTE
    SMOTE_AVAILABLE = True
except Exception:
    SMOTE_AVAILABLE = False

try:
    import scorecardpy as sc
    SCORECARDPY_AVAILABLE = True
except Exception:
    SCORECARDPY_AVAILABLE = False

NUMERIC_FEATURES = [
    "payment_history_pct",
    "amounts_owed",
    "credit_utilization_ratio",
    "credit_length_months",
    "new_inquiries_6m",
    "credit_mix_count",
    "annual_income",
    "age",
    "mobile_usage_score",
    "utility_payment_ratio",
    "rental_history_months",
    "digital_payment_frequency",
]

CATEGORICAL_FEATURES = ["employment_status", "zip_code"]


def impute(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    num_imputer = SimpleImputer(strategy="median")
    cat_imputer = SimpleImputer(strategy="most_frequent")

    existing_num = [c for c in NUMERIC_FEATURES if c in df.columns]
    existing_cat = [c for c in CATEGORICAL_FEATURES if c in df.columns]

    if existing_num:
        df[existing_num] = num_imputer.fit_transform(df[existing_num])
    if existing_cat:
        df[existing_cat] = cat_imputer.fit_transform(df[existing_cat])
    return df


def encode_categoricals(
    df: pd.DataFrame, target_col: str = "target"
) -> pd.DataFrame:
    df = df.copy()
    cats = [c for c in CATEGORICAL_FEATURES if c in df.columns]

    if SCORECARDPY_AVAILABLE and target_col in df.columns:
        try:
            bins = sc.woebin(df[cats + [target_col]], y=target_col)
            df_woe = sc.woebin_ply(df[cats + [target_col]], bins)
            for col in cats:
                woe_col = f"{col}_woe"
                if woe_col in df_woe.columns:
                    df[col] = df_woe[woe_col].values
            return df
        except Exception:
            pass

    for col in cats:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
    return df


def apply_smote(
    X: np.ndarray, y: np.ndarray, random_state: int = 42
) -> tuple[np.ndarray, np.ndarray]:
    if SMOTE_AVAILABLE:
        try:
            sm = SMOTE(random_state=random_state)
            X_res, y_res = sm.fit_resample(X, y)
            return X_res, y_res
        except Exception:
            pass
    return X, y


def get_tscv(n_splits: int = 5) -> TimeSeriesSplit:
    return TimeSeriesSplit(n_splits=n_splits)


def full_preprocess(
    df: pd.DataFrame, target_col: str = "target"
) -> tuple[np.ndarray, np.ndarray, list[str]]:
    df = impute(df)
    df = encode_categoricals(df, target_col)

    feature_cols = [
        c for c in df.columns if c not in [target_col, "probability_of_default"]
    ]
    X = df[feature_cols].select_dtypes(include=[np.number]).values
    y = df[target_col].values
    feat_names = df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()

    X, y = apply_smote(X, y)
    return X, y, feat_names
