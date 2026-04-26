from fastapi import APIRouter
from ..core.config import ml_settings
from ..models.bert_model import _finbert_pipeline

router = APIRouter()


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "finbert_available": ml_settings.USE_FINBERT and _finbert_pipeline is not None,
        "gnn_available": ml_settings.USE_GNN,
        "federated_available": ml_settings.USE_FEDERATED,
    }
