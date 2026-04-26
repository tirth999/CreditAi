from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .routers import auth, score, fairness, drift, models, federated, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="CreditAI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(score.router, prefix="/api", tags=["score"])
app.include_router(fairness.router, prefix="/api/fairness", tags=["fairness"])
app.include_router(drift.router, prefix="/api/drift", tags=["drift"])
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(federated.router, prefix="/api/federated", tags=["federated"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])


@app.get("/health")
async def health():
    return {"status": "ok"}
