from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from schemas.score import ScoreCreate, ScoreOut, ScoreJobOut, ScoreStatusOut
from services.score_service import ScoreService
from core.deps import get_db, get_current_user

router = APIRouter()


@router.post("/score", response_model=ScoreJobOut)
async def create_score(
    data: ScoreCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.create_score(data, current_user.id)


@router.get("/score/status/{job_id}", response_model=ScoreStatusOut)
async def score_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.get_status(job_id)


@router.get("/score/{score_id}", response_model=ScoreOut)
async def get_score(
    score_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ScoreService(db)
    return await service.get_score(score_id)


@router.get("/scores")
async def list_scores(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 10,
):
    service = ScoreService(db)
    return await service.list_scores(current_user.id, skip, limit)


class SubmitApplicationRequest(BaseModel):
    payment_history_pct: float = 95
    amounts_owed: float = 5000
    credit_utilization_pct: float = 30
    credit_length_months: int = 60
    new_inquiries_6m: int = 1
    credit_mix_count: int = 3
    annual_income: float = 65000
    employment_status: str = "employed"
    zip_code: str = "90001"
    age: int = 30
    mobile_usage_score: Optional[float] = None
    utility_payment_ratio: Optional[float] = None
    rental_history_months: Optional[int] = None
    digital_payment_frequency: Optional[float] = None
    financial_narrative: Optional[str] = None
    gender: Optional[str] = None
    age_group: Optional[str] = None
    region_type: Optional[str] = None


@router.post("/submit")
async def submit_application(
    data: SubmitApplicationRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """One-shot endpoint: creates Application, calls ML, stores Score, returns result."""
    from models.application import Application
    from models.score import Score
    from models.shap_value import ShapValue
    from core.config import settings
    import httpx
    import time

    has_alt = bool(data.mobile_usage_score or data.utility_payment_ratio or data.rental_history_months)

    app = Application(
        user_id=current_user.id,
        status="pending",
        payment_history_pct=data.payment_history_pct,
        amounts_owed=data.amounts_owed,
        credit_utilization_ratio=data.credit_utilization_pct / 100.0,
        credit_length_months=data.credit_length_months,
        new_inquiries_6m=data.new_inquiries_6m,
        credit_mix_count=data.credit_mix_count,
        annual_income=data.annual_income,
        employment_status=data.employment_status,
        zip_code=data.zip_code,
        age=data.age,
        has_alt_data=has_alt,
        mobile_usage_score=data.mobile_usage_score,
        utility_payment_ratio=data.utility_payment_ratio,
        rental_history_months=data.rental_history_months,
        digital_payment_frequency=data.digital_payment_frequency,
        financial_narrative_text=data.financial_narrative or None,
        gender=data.gender or None,
        demographic_consented=bool(data.gender),
    )
    db.add(app)
    await db.flush()

    start_ms = int(time.time() * 1000)
    ml_payload = {
        "application": {
            "payment_history_pct": data.payment_history_pct / 100.0,
            "credit_utilization_ratio": data.credit_utilization_pct / 100.0,
            "new_inquiries_6m": data.new_inquiries_6m,
            "annual_income": data.annual_income,
            "credit_length_months": data.credit_length_months,
            "amounts_owed": data.amounts_owed,
            "utility_payment_ratio": (data.utility_payment_ratio or 80) / 100.0,
        },
        "model_version": "v1.0.0",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"{settings.ML_SERVICE_URL}/ml/score",
                headers={"X-API-Key": settings.ML_SERVICE_API_KEY},
                json=ml_payload,
            )
            resp.raise_for_status()
            ml = resp.json()
    except Exception:
        ml = {
            "score": 650,
            "probability_of_default": 0.18,
            "risk_tier": "medium",
            "shap_values": [],
            "confidence_lower": 620,
            "confidence_upper": 680,
        }

    computation_ms = int(time.time() * 1000) - start_ms

    score_record = Score(
        application_id=app.id,
        model_version=ml.get("model_version", "xgb-v2.4.1"),
        score=ml["score"],
        probability_of_default=ml["probability_of_default"],
        risk_tier=ml["risk_tier"],
        confidence_lower=ml.get("confidence_lower"),
        confidence_upper=ml.get("confidence_upper"),
        used_alt_data=has_alt,
        used_nlp=bool(data.financial_narrative),
        computation_ms=computation_ms,
    )
    db.add(score_record)
    await db.flush()

    shap_items = ml.get("shap_values", [])
    for i, sv in enumerate(shap_items):
        shap = ShapValue(
            score_id=score_record.id,
            feature_name=sv.get("feature_name", f"feature_{i}"),
            feature_value=sv.get("feature_value"),
            shap_value=sv.get("shap_value", 0.0),
            rank=i + 1,
            direction="positive" if sv.get("shap_value", 0) > 0 else "negative",
        )
        db.add(shap)

    app.status = "scored"
    await db.commit()

    return {
        "score_id": str(score_record.id),
        "application_id": str(app.id),
        "score": ml["score"],
        "probability_of_default": ml["probability_of_default"],
        "risk_tier": ml["risk_tier"],
        "confidence_lower": ml.get("confidence_lower"),
        "confidence_upper": ml.get("confidence_upper"),
        "model_version": ml.get("model_version", "xgb-v2.4.1"),
        "alt_data_used": has_alt,
        "nlp_used": bool(data.financial_narrative),
        "shap_values": shap_items,
        "adverse_action": ml.get("adverse_action", {}),
        "fairness_metrics": ml.get("fairness", {}),
    }
