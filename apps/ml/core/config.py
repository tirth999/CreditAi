from pydantic_settings import BaseSettings


class MLSettings(BaseSettings):
    ML_SERVICE_API_KEY: str = ""
    MODEL_ARTIFACT_DIR: str = "./artifacts"
    MLFLOW_TRACKING_URI: str = "./mlruns"
    KAGGLE_USERNAME: str = ""
    KAGGLE_KEY: str = ""
    HF_TOKEN: str = ""
    USE_FINBERT: bool = True
    USE_GNN: bool = True
    USE_FEDERATED: bool = True

    class Config:
        env_file = ".env"


ml_settings = MLSettings()
