from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import ml_settings
from .routers import score, train, federated, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="CreditAI ML", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def api_key_middleware(request: Request, call_next):
    if request.url.path in ["/docs", "/openapi.json", "/health", "/ml/health"]:
        return await call_next(request)
    api_key = request.headers.get("X-API-Key")
    if api_key != ml_settings.ML_SERVICE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API key"
        )
    return await call_next(request)


app.include_router(score.router, prefix="/ml", tags=["score"])
app.include_router(train.router, prefix="/ml", tags=["train"])
app.include_router(federated.router, prefix="/ml", tags=["federated"])
app.include_router(health.router, prefix="/ml", tags=["health"])


@app.get("/health")
async def health_root():
    return {"status": "ok"}
