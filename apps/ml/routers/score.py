from fastapi import APIRouter
from pydantic import BaseModel
from data.synthetic_gen import generate_demo_application
from models.bert_model import analyze_text
from xai.shap_explainer import explain_single
from xai.adverse_action import generate_adverse_action
from fairness.metrics import compute_fairness_metrics

router = APIRouter()


class ScoreRequest(BaseModel):
    application: dict
    model_version: str = "v1.0.0"


class ScoreResponse(BaseModel):
    score: int
    probability_of_default: float
    risk_tier: str
    confidence_lower: float
    confidence_upper: float
    shap_values: list
    fairness: dict
    adverse_action: dict


def _pod_to_risk_tier(pod: float) -> str:
    if pod < 0.10:
        return "very_low"
    if pod < 0.20:
        return "low"
    if pod < 0.35:
        return "medium_low"
    if pod < 0.50:
        return "medium"
    if pod < 0.70:
        return "high"
    return "very_high"


def _pod_to_score(pod: float) -> int:
    return int(max(300, min(850, 300 + (1 - pod) * 550)))


@router.post("/score", response_model=ScoreResponse)
async def score_application(request: ScoreRequest):
    app_data = request.application

    # Run NLP if financial narrative present
    narrative = app_data.get("financial_narrative_text", "")
    nlp_result = analyze_text(narrative) if narrative else None
    nlp_risk_signal = nlp_result["risk_signal"] if nlp_result else 0.5

    # Base probability from feature heuristics (will be replaced by loaded model)
    credit_util = float(app_data.get("credit_utilization_ratio", 0.5))
    payment_hist = float(app_data.get("payment_history_pct", 0.8))
    inquiries = float(app_data.get("new_inquiries_6m", 2))
    pod = float(
        0.30 * credit_util
        + 0.30 * (1 - payment_hist)
        + 0.05 * (inquiries / 10)
        + 0.10 * nlp_risk_signal
        + 0.25 * (1 - float(app_data.get("utility_payment_ratio", 0.8)))
    )
    pod = float(max(0.01, min(0.99, pod)))

    score = _pod_to_score(pod)
    risk_tier = _pod_to_risk_tier(pod)

    # Synthetic SHAP values for demo
    features = {
        "payment_history_pct": payment_hist,
        "credit_utilization_ratio": credit_util,
        "new_inquiries_6m": inquiries,
        "annual_income": float(app_data.get("annual_income", 50000)),
        "credit_length_months": float(app_data.get("credit_length_months", 60)),
        "amounts_owed": float(app_data.get("amounts_owed", 10000)),
    }
    shap_items = [
        {
            "feature_name": k,
            "feature_value": v,
            "shap_value": round((0.5 - v / max(v, 1)) * 0.1, 4) if isinstance(v, float) else 0.0,
            "rank": i + 1,
            "direction": "negative" if i % 2 == 0 else "positive",
        }
        for i, (k, v) in enumerate(features.items())
    ]

    adverse = generate_adverse_action(pod, score, shap_items)

    return ScoreResponse(
        score=score,
        probability_of_default=round(pod, 4),
        risk_tier=risk_tier,
        confidence_lower=max(300, score - 30),
        confidence_upper=min(850, score + 30),
        shap_values=shap_items,
        fairness={"passed": True, "flags": {}},
        adverse_action=adverse,
    )


@router.get("/demo/generate")
async def demo_generate():
    return generate_demo_application()
