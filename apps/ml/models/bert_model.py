import logging
from typing import Any

logger = logging.getLogger(__name__)

_finbert_pipeline: Any = None
_FINBERT_MODEL = "ProsusAI/finbert"

_NEUTRAL_FALLBACK = {
    "sentiment": "neutral",
    "sentiment_scores": {"positive": 0.33, "neutral": 0.34, "negative": 0.33},
    "risk_signal": 0.5,
    "key_phrases": [],
    "embedding": [0.0] * 768,
}


def _load_finbert() -> None:
    global _finbert_pipeline
    if _finbert_pipeline is not None:
        return
    try:
        from transformers import pipeline, AutoTokenizer, AutoModel
        import torch
        from core.config import ml_settings

        if not ml_settings.USE_FINBERT or not ml_settings.HF_TOKEN:
            return

        _finbert_pipeline = pipeline(
            "text-classification",
            model=_FINBERT_MODEL,
            tokenizer=_FINBERT_MODEL,
            token=ml_settings.HF_TOKEN,
            top_k=None,
            device=-1,  # CPU only
        )
        logger.info("FinBERT pipeline loaded successfully")
    except Exception as e:
        logger.warning(f"FinBERT load failed: {e}")
        _finbert_pipeline = None


def _get_cls_embedding(text: str) -> list[float]:
    try:
        import torch
        from transformers import AutoTokenizer, AutoModel
        from core.config import ml_settings

        tokenizer = AutoTokenizer.from_pretrained(
            _FINBERT_MODEL, token=ml_settings.HF_TOKEN
        )
        model = AutoModel.from_pretrained(
            _FINBERT_MODEL, token=ml_settings.HF_TOKEN
        )
        inputs = tokenizer(
            text, return_tensors="pt", truncation=True, max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)
        cls = outputs.last_hidden_state[:, 0, :].squeeze().tolist()
        return cls
    except Exception:
        return [0.0] * 768


def _extract_key_phrases(text: str) -> list[str]:
    """Simple keyword extraction — no external NLP deps required."""
    risk_keywords = [
        "debt", "default", "late", "overdue", "bankruptcy", "foreclosure",
        "stable", "employed", "income", "savings", "consistent", "on time",
    ]
    words = text.lower().split()
    found = [kw for kw in risk_keywords if kw in words]
    return found[:5]


def analyze_text(text: str) -> dict:
    """Run FinBERT sentiment analysis on financial narrative text.
    Returns neutral fallback on any failure.
    """
    if not text or not text.strip():
        return _NEUTRAL_FALLBACK.copy()

    try:
        _load_finbert()
        if _finbert_pipeline is None:
            raise RuntimeError("FinBERT not loaded")

        results = _finbert_pipeline(text[:512])
        scores: dict[str, float] = {}
        for item in results[0]:
            scores[item["label"].lower()] = float(item["score"])

        sentiment = max(scores, key=scores.get)

        # risk signal: negative sentiment = higher risk
        risk_signal = (
            scores.get("negative", 0.33) * 0.7
            + scores.get("neutral", 0.33) * 0.3
            - scores.get("positive", 0.33) * 0.2
        )
        risk_signal = float(min(max(risk_signal, 0.0), 1.0))

        embedding = _get_cls_embedding(text)
        key_phrases = _extract_key_phrases(text)

        return {
            "sentiment": sentiment,
            "sentiment_scores": {
                "positive": scores.get("positive", 0.33),
                "neutral": scores.get("neutral", 0.34),
                "negative": scores.get("negative", 0.33),
            },
            "risk_signal": risk_signal,
            "key_phrases": key_phrases,
            "embedding": embedding,
        }
    except Exception as e:
        logger.warning(f"FinBERT inference failed: {e}")
        return _NEUTRAL_FALLBACK.copy()
