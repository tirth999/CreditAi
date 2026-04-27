"""
CreditAI — Database Seeder
Usage:
  python scripts/seed_db.py --direct   (SQLAlchemy async, no API needed)
  python scripts/seed_db.py --api      (POST to running API endpoints)
"""

import asyncio
import argparse
import uuid
import sys
import os
from datetime import datetime, timedelta
import random

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

FEATURES = [
    "payment_history_pct", "credit_utilization_ratio", "credit_length_months",
    "new_inquiries_6m", "amounts_owed", "annual_income", "mobile_usage_score", "credit_mix_count",
]


async def seed_direct():
    from apps.api.core.database import AsyncSessionLocal
    from apps.api.models.user import User
    from apps.api.models.application import Application
    from apps.api.models.score import Score
    from apps.api.models.shap_value import ShapValue
    from apps.api.models.fairness_report import FairnessReport
    from apps.api.models.drift_report import DriftReport
    from apps.api.models.model_registry import ModelRegistry
    from apps.api.models.audit_log import AuditLog

    async with AsyncSessionLocal() as session:
        # ── Users ──
        admin = User(
            id=uuid.uuid4(),
            email="admin@creditai.dev",
            password_hash=pwd_context.hash("Admin123!"),
            full_name="Admin User",
            role="admin",
        )
        demo = User(
            id=uuid.uuid4(),
            email="demo@creditai.dev",
            password_hash=pwd_context.hash("Demo123!"),
            full_name="Demo User",
            role="user",
        )
        session.add_all([admin, demo])
        await session.flush()
        print("[1/6] ✓ Created users: admin@creditai.dev, demo@creditai.dev")

        # ── Applications + Scores + SHAP + Fairness ──
        score_ids = []
        for i in range(50):
            app = Application(
                id=uuid.uuid4(),
                user_id=demo.id,
                created_at=datetime.utcnow() - timedelta(days=i),
                status="completed",
                payment_history_pct=round(random.uniform(70, 100), 2),
                amounts_owed=round(random.uniform(1000, 50000), 2),
                credit_utilization_ratio=round(random.uniform(10, 90), 2),
                credit_length_months=random.randint(12, 240),
                new_inquiries_6m=random.randint(0, 5),
                credit_mix_count=random.randint(1, 8),
                annual_income=round(random.uniform(30000, 150000), 2),
                age=random.randint(22, 65),
                employment_status=random.choice(["employed", "self-employed", "retired"]),
                zip_code=str(random.randint(10000, 99999)),
            )
            session.add(app)
            await session.flush()

            score_val = random.randint(580, 820)
            pd_val = round(random.uniform(0.05, 0.45), 4)
            tier = (
                "Low" if score_val >= 740
                else "Medium-Low" if score_val >= 670
                else "Medium-High" if score_val >= 580
                else "High"
            )
            score = Score(
                id=uuid.uuid4(),
                application_id=app.id,
                model_version="v1.0.0",
                score=score_val,
                probability_of_default=pd_val,
                risk_tier=tier,
                confidence_lower=max(300, score_val - 30),
                confidence_upper=min(850, score_val + 30),
                computation_ms=random.randint(200, 800),
            )
            session.add(score)
            await session.flush()
            score_ids.append(score.id)

            for rank, feat in enumerate(FEATURES):
                shap_val = round(random.uniform(-0.3, 0.3), 5)
                session.add(ShapValue(
                    id=uuid.uuid4(),
                    score_id=score.id,
                    feature_name=feat,
                    feature_value=round(random.uniform(0, 1), 4),
                    shap_value=shap_val,
                    rank=rank,
                    direction="positive" if shap_val >= 0 else "negative",
                ))

            dpd = round(random.uniform(0.01, 0.15), 4)
            eod = round(random.uniform(0.01, 0.15), 4)
            dir_val = round(random.uniform(0.75, 0.95), 4)
            passed = dpd < 0.10 and eod < 0.10 and dir_val > 0.80
            if i < 5:
                dpd, eod, dir_val, passed = 0.14, 0.12, 0.72, False
            session.add(FairnessReport(
                id=uuid.uuid4(),
                score_id=score.id,
                model_version="v1.0.0",
                demographic_parity_diff=dpd,
                equalized_odds_diff=eod,
                disparate_impact_ratio=dir_val,
                statistical_parity_diff=round(random.uniform(0.01, 0.12), 4),
                equal_opportunity_diff=round(random.uniform(0.01, 0.10), 4),
                flags={"dpd": dpd > 0.10, "eod": eod > 0.10, "dir": dir_val < 0.80},
                passed_regulatory_threshold=passed,
            ))

        print("[2/6] ✓ Created 50 applications, scores, SHAP values, fairness reports")

        # ── Model Registry ──
        session.add(ModelRegistry(
            id=uuid.uuid4(),
            version="v1.0.0",
            algorithm="XGBoost",
            dataset="GiveMeSomeCredit + Synthetic",
            auc_roc=0.823,
            f1_score=0.741,
            gini_coefficient=0.646,
            accuracy=0.872,
            train_date=datetime.utcnow() - timedelta(days=7),
            is_active=True,
            artifact_path="./artifacts/v1.0.0/model.onnx",
            parameters={"n_estimators": 500, "max_depth": 6, "learning_rate": 0.05},
            fairness_baseline={"demographic_parity_diff": 0.07, "equalized_odds_diff": 0.06},
            training_samples=50000,
        ))
        print("[3/6] ✓ Created model registry entry: XGBoost v1.0.0 (AUC=0.823)")

        # ── Drift Report ──
        session.add(DriftReport(
            id=uuid.uuid4(),
            model_version="v1.0.0",
            psi_scores={f: round(random.uniform(0.01, 0.08), 4) for f in FEATURES},
            ks_results={
                f: {
                    "statistic": round(random.uniform(0.01, 0.08), 4),
                    "p_value": round(random.uniform(0.2, 0.9), 4),
                }
                for f in FEATURES
            },
            drift_detected=False,
            features_drifted=[],
            auc_at_report=0.821,
        ))
        print("[4/6] ✓ Created drift report (no drift, all PSI < 0.1)")

        # ── Audit Logs ──
        actions = ["score_created", "application_submitted", "report_viewed", "model_promoted", "login", "fairness_audit"]
        for j in range(50):
            session.add(AuditLog(
                id=uuid.uuid4(),
                user_id=random.choice([admin.id, demo.id]),
                action=random.choice(actions),
                application_id=random.choice(score_ids) if random.random() > 0.3 else None,
                timestamp=datetime.utcnow() - timedelta(minutes=random.randint(0, 10000)),
                ip_address=f"192.168.1.{random.randint(10, 250)}",
            ))
        print("[5/6] ✓ Created 50 audit log entries")

        await session.commit()
        print("[6/6] ✓ Seed complete — all data committed")
        print()
        print("  Login credentials:")
        print("    admin@creditai.dev / Admin123!")
        print("    demo@creditai.dev  / Demo123!")


async def seed_api():
    import httpx

    base = os.getenv("API_URL", "http://localhost:8000")
    async with httpx.AsyncClient(base_url=base, timeout=30) as client:
        # Register users
        for email, pw, name, role in [
            ("admin@creditai.dev", "Admin123!", "Admin User", "admin"),
            ("demo@creditai.dev", "Demo123!", "Demo User", "user"),
        ]:
            r = await client.post("/api/auth/register", json={
                "email": email, "password": pw, "full_name": name,
            })
            print(f"Register {email}: {r.status_code}")

        # Login as demo
        r = await client.post("/api/auth/login", json={
            "email": "demo@creditai.dev", "password": "Demo123!",
        })
        token = r.json().get("access_token", "")
        headers = {"Authorization": f"Bearer {token}"}

        # Submit applications
        for i in range(10):
            r = await client.post("/api/score", json={
                "payment_history_pct": round(random.uniform(70, 100), 2),
                "amounts_owed": round(random.uniform(1000, 50000), 2),
                "credit_utilization_pct": round(random.uniform(10, 90), 2),
                "credit_length_months": random.randint(12, 240),
                "new_inquiries_6m": random.randint(0, 5),
                "credit_mix_count": random.randint(1, 8),
                "annual_income": round(random.uniform(30000, 150000), 2),
                "employment_status": "employed",
                "zip_code": str(random.randint(10000, 99999)),
                "age": random.randint(22, 65),
            }, headers=headers)
            print(f"  Application {i+1}/10: {r.status_code}")

        print("API seed complete (10 applications)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CreditAI Database Seeder")
    parser.add_argument("--direct", action="store_true", help="Seed directly via SQLAlchemy (no API needed)")
    parser.add_argument("--api", action="store_true", help="Seed via running API endpoints")
    args = parser.parse_args()

    if args.direct:
        asyncio.run(seed_direct())
    elif args.api:
        asyncio.run(seed_api())
    else:
        print("Usage: python scripts/seed_db.py --direct|--api")
        sys.exit(1)
