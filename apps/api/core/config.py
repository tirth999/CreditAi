from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path

_root = Path(__file__).resolve().parent.parent.parent.parent  # CreditAi/


class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_SYNC: str

    JWT_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    NEXTAUTH_SECRET: str

    UPSTASH_REDIS_REST_URL: str
    UPSTASH_REDIS_REST_TOKEN: str

    REDIS_URL: str = "redis://localhost:6379"

    ML_SERVICE_URL: str = "http://localhost:8001"
    ML_SERVICE_API_KEY: str

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    MODEL_ARTIFACT_DIR: str = "./artifacts"

    class Config:
        env_file = (str(_root / ".env"), ".env")
        case_sensitive = True
        extra = "ignore"


settings = Settings()
