<p align="center">
  <img src="https://img.shields.io/badge/CPSC_589-Research_Project-gold?style=for-the-badge" alt="CPSC 589" />
  <img src="https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/XGBoost-FF6600?style=for-the-badge" alt="XGBoost" />
  <img src="https://img.shields.io/badge/SHAP-purple?style=for-the-badge" alt="SHAP" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

# CreditAI — Explainable & Fair AI Credit Scoring Platform

> **CPSC 589 · Tirth Isamaliya · Advisor: Dr. Kenneth Kung · California State University, Fullerton**

A production-grade credit scoring platform that solves 7 open problems in AI-powered credit assessment through explainability (SHAP, LIME), algorithmic fairness (AIF360, Fairlearn), conformal prediction, NLP integration (FinBERT), and continuous drift monitoring.

---

## 📚 Research Problems Addressed

| # | Paper | Year | Open Problem | CreditAI Solution |
|---|-------|------|-------------|-------------------|
| 1 | Bücker et al. — "Transparency, auditability, and explainability of ML models in credit scoring" | 2022 | Black-box ML models lack transparency for regulatory compliance | SHAP waterfall + beeswarm visualizations, LIME comparison, interpretable model (EBM) benchmarking |
| 2 | Hurlin et al. — "Fairness in Credit Scoring" | 2024 | Demographic bias in automated lending decisions | AIF360/Fairlearn fairness audit with 5 metrics, demographic parity, equalized odds, disparate impact monitoring |
| 3 | Gunnarsson et al. — "Deep Learning for Credit Scoring: Do or Don't" | 2021 | Uncertainty quantification missing from credit score predictions | Conformal prediction intervals via MAPIE with 95% coverage guarantees |
| 4 | Dastile et al. — "Statistical and Machine Learning Models in Credit Scoring" | 2020 | Traditional credit features exclude thin-file applicants | Alternative data pipeline (mobile usage, utility payments, rental history) with feature importance tracking |
| 5 | Bussmann et al. — "Explainable Machine Learning in Credit Risk Management" | 2021 | No standardized comparison between explanation methods | Side-by-side LIME vs SHAP with agreement scoring, interpretable vs black-box accuracy tradeoff analysis |
| 6 | Misheva et al. — "Explainable AI in Credit Risk Management" | 2021 | Model performance degradation undetected in production | PSI drift detection, KS tests, AUC monitoring, automated retrain triggers via Celery |
| 7 | Weber et al. — "NLP Applications in Credit Risk" | 2023 | Unstructured text data unused in credit assessment | FinBERT financial narrative embedding for thin-file applicants with NLP feature integration |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 14 Frontend                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │Dashboard │ │Score     │ │XAI       │ │Fairness/Drift/   │ │
│  │Overview  │ │Detail    │ │Explorer  │ │Models/Admin      │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       └─────────────┴───────────┴────────────────┘           │
│                          │ REST API                           │
├──────────────────────────┼───────────────────────────────────┤
│              FastAPI Backend (Port 8000)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │Auth/JWT  │ │Score API │ │Fairness  │ │Drift/Models/     │ │
│  │NextAuth  │ │+ Submit  │ │Audit     │ │Admin/Audit       │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       │            │            │                 │           │
│  ┌────┴────────────┴────────────┴─────────────────┘          │
│  │  Neon PostgreSQL    │  Upstash Redis    │  Celery         │
├──┴─────────────────────┴──────────────────┴──────────────────┤
│              ML Microservice (Port 8001)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │XGBoost   │ │SHAP/LIME │ │FinBERT   │ │Conformal         │ │
│  │Ensemble  │ │Explainer │ │NLP       │ │Prediction(MAPIE) │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User logs in   →  NextAuth → FastAPI /api/auth/login → JWT issued
2. Submit form    →  Frontend → FastAPI /api/submit → Application created in PostgreSQL
3. ML scoring     →  FastAPI  → ML Service /ml/score → XGBoost + SHAP + Fairness
4. Store result   →  Score + SHAP values persisted in PostgreSQL
5. Dashboard      →  Frontend reads from API → Renders charts/tables
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Dashboard, SSR, routing |
| **UI** | shadcn/ui, Radix, Vanilla CSS | Component library, glassmorphism design |
| **Charts** | D3.js, Recharts | Score gauge, SHAP waterfall/beeswarm, drift timeline |
| **State** | Zustand, React Query | Client state, server cache |
| **Auth** | NextAuth v4, JWT | Credentials auth with real backend, demo fallback |
| **API** | FastAPI, Pydantic v2 | REST endpoints, async DB, validation |
| **Database** | PostgreSQL (Neon), SQLAlchemy 2.0 | Async ORM, migrations (Alembic) |
| **Cache** | Upstash Redis (REST) | Session cache, rate limiting |
| **ML** | XGBoost, scikit-learn | Credit scoring, feature engineering |
| **XAI** | SHAP, Fairlearn | Model explainability, fairness audit |
| **NLP** | FinBERT (HuggingFace) | Financial narrative analysis |
| **Drift** | PSI, KS test | Feature drift detection |

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Check |
|------------|---------|-------|
| **Node.js** | ≥ 18 | `node --version` |
| **pnpm** | ≥ 8 | `pnpm --version` (install: `npm install -g pnpm`) |
| **Python** | ≥ 3.9 | `python3 --version` |
| **Git** | any | `git --version` |

### 1. Clone & Install Frontend

```bash
git clone https://github.com/tirth999/CreditAi.git
cd CreditAi
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section below)
```

### 3. Set Up API Backend

```bash
# Create virtual environment
cd apps/api
python3 -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate          # Windows

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
PYTHONPATH=../.. python3 -m alembic upgrade head

# Seed demo data (optional)
python3 ../../scripts/seed_db.py --direct

deactivate
cd ../..
```

### 4. Set Up ML Service

```bash
cd apps/ml
python3 -m venv venv
source venv/bin/activate

# Use the trimmed requirements for local dev
# (avoids pydantic version conflicts with evidently, opacus, etc.)
pip install --upgrade pip
pip install -r requirements-local.txt

deactivate
cd ../..
```

### 5. Start All Services

Open **3 separate terminals** from the project root:

```bash
# Terminal 1 — Frontend (port 3000)
pnpm dev

# Terminal 2 — API Backend (port 8000)
cd apps/api && source venv/bin/activate
PYTHONPATH=../.. uvicorn main:app --reload --port 8000

# Terminal 3 — ML Service (port 8001)
cd apps/ml && source venv/bin/activate
PYTHONPATH=../.. uvicorn main:app --reload --port 8001
```

### 6. Open the App

Navigate to **http://localhost:3000** and log in with the demo credentials.

> **Note:** The frontend works in standalone mode even without the backend services. When backends are unreachable, it uses demo-credential fallback auth and client-side scoring. With backends running, it uses real JWT auth, ML scoring, and PostgreSQL persistence.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@creditai.dev` | `Admin123!` |
| **Demo User** | `demo@creditai.dev` | `Demo123!` |

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | ✅ | Random secret for NextAuth session encryption |
| `NEXTAUTH_URL` | ✅ | Frontend URL (default: `http://localhost:3000`) |
| `DATABASE_URL` | ✅ | PostgreSQL connection string (async — `postgresql+asyncpg://...`) |
| `DATABASE_URL_SYNC` | ✅ | PostgreSQL connection string (sync — for Alembic migrations) |
| `JWT_SECRET_KEY` | ✅ | Secret for JWT token signing |
| `ML_SERVICE_URL` | ✅ | ML service URL (default: `http://localhost:8001`) |
| `ML_SERVICE_API_KEY` | ✅ | API key for ML service authentication |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST endpoint for session cache |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis auth token |
| `HF_TOKEN` | Optional | HuggingFace token for FinBERT NLP model |
| `KAGGLE_USERNAME` | Optional | Kaggle API credentials for dataset downloads |
| `KAGGLE_KEY` | Optional | Kaggle API key |
| `BACKEND_CORS_ORIGINS` | ✅ | JSON array of allowed CORS origins |

The frontend also reads from `apps/web/.env.local`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | API backend URL for browser requests |
| `BACKEND_URL` | `http://localhost:8000` | API backend URL for server-side auth calls |

---

## 📖 API Documentation

When the services are running, interactive API docs are available:

| Service | URL | Docs |
|---------|-----|------|
| **API Backend** | `http://localhost:8000` | [Swagger UI](http://localhost:8000/docs) |
| **ML Service** | `http://localhost:8001` | [Swagger UI](http://localhost:8001/docs) |

### Key Endpoints

```
Auth:
  POST /api/auth/register            — Register new user
  POST /api/auth/login               — Login, returns JWT + refresh token

Scoring:
  POST /api/submit                   — Submit application → ML score → DB persist (one-shot)
  POST /api/score                    — Score existing application by ID
  GET  /api/score/status/{job_id}    — Poll scoring job status
  GET  /api/score/{id}               — Get score detail with SHAP values
  GET  /api/scores?skip=0&limit=10   — List user's scores (paginated)

Fairness & Drift:
  GET  /api/fairness/{score_id}      — Fairness report for a score
  GET  /api/fairness/aggregate       — Aggregate fairness metrics
  GET  /api/drift/latest             — Latest drift report
  POST /api/drift/retrain            — Trigger model retrain (admin)

Models:
  GET  /api/models                   — List model registry
  POST /api/models/promote           — Promote model to production (admin)

ML Service:
  POST /ml/score                     — Direct ML scoring (requires X-API-Key header)
  POST /ml/train                     — Trigger model training
  GET  /health                       — Service health check
```

---

## 📁 Project Structure

```
CreditAi/
├── apps/
│   ├── api/                        # FastAPI backend (port 8000)
│   │   ├── core/                   # Config, database, deps, security
│   │   │   ├── config.py           # Pydantic settings (reads .env)
│   │   │   ├── database.py         # Async SQLAlchemy engine
│   │   │   ├── deps.py             # FastAPI dependencies (auth, DB)
│   │   │   └── security.py         # JWT encode/decode, password hashing
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   │   ├── user.py             # User (id, email, role, password_hash)
│   │   │   ├── application.py      # Application (all credit features)
│   │   │   ├── score.py            # Score (score, risk_tier, PD, model_version)
│   │   │   ├── shap_value.py       # ShapValue (feature_name, shap_value, rank)
│   │   │   ├── model_registry.py   # ModelRegistry (version, metrics, is_active)
│   │   │   └── ...                 # fairness_report, drift_report, audit_log
│   │   ├── routers/                # API route handlers
│   │   │   ├── auth.py             # /api/auth/register, /api/auth/login
│   │   │   ├── score.py            # /api/submit, /api/score, /api/scores
│   │   │   └── ...                 # fairness, drift, models, admin
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # Business logic (score_service, auth_service)
│   │   ├── migrations/             # Alembic database migrations
│   │   │   └── versions/0001_initial_schema.py
│   │   ├── requirements.txt        # Python dependencies
│   │   └── main.py                 # FastAPI app entry point
│   │
│   ├── ml/                         # ML microservice (port 8001)
│   │   ├── models/                 # ML models
│   │   │   ├── xgboost_model.py    # XGBoost classifier
│   │   │   ├── bert_model.py       # FinBERT NLP pipeline
│   │   │   └── ...                 # LightGBM, Logistic, EBM, GNN, Ensemble
│   │   ├── xai/                    # Explainability
│   │   │   ├── shap_explainer.py   # SHAP TreeExplainer / KernelExplainer
│   │   │   ├── adverse_action.py   # ECOA Regulation B adverse action notices
│   │   │   └── ebm_explainer.py    # Interpretable EBM model
│   │   ├── fairness/               # Fairness metrics (Fairlearn, AIF360)
│   │   ├── drift/                  # Drift detection (PSI, ADWIN)
│   │   ├── data/                   # Data loaders & synthetic generation
│   │   ├── routers/                # ML API routes (/ml/score, /ml/train)
│   │   ├── requirements.txt        # Full ML dependencies
│   │   ├── requirements-local.txt  # Trimmed deps for local dev (Python 3.9 safe)
│   │   └── main.py                 # FastAPI ML service entry point
│   │
│   └── web/                        # Next.js 14 frontend (port 3000)
│       ├── app/                    # App Router
│       │   ├── (public)/           # Public pages
│       │   │   ├── page.tsx        # Landing page
│       │   │   ├── login/          # Login page
│       │   │   └── register/       # Registration page
│       │   └── (protected)/        # Auth-protected dashboard
│       │       └── dashboard/
│       │           ├── page.tsx               # Overview dashboard
│       │           ├── new-application/       # 3-step application form
│       │           ├── score-history/         # Score history table
│       │           ├── scores/[id]/           # Score detail (gauge, SHAP, CI)
│       │           ├── xai-explorer/          # XAI analysis page
│       │           ├── fairness/              # Fairness audit page
│       │           ├── drift/                 # Drift monitoring
│       │           ├── models/                # Model registry
│       │           └── settings/              # User settings
│       ├── components/
│       │   ├── charts/             # D3/Recharts visualizations
│       │   │   ├── ScoreGauge.tsx   # Animated SVG circular progress
│       │   │   ├── ShapWaterfall.tsx # SHAP feature importance bars
│       │   │   └── ...              # 7 chart components
│       │   ├── forms/              # ApplicationForm (3-step wizard)
│       │   ├── dashboard/          # Dashboard widgets
│       │   ├── layout/             # Sidebar, Topbar
│       │   └── ui/                 # shadcn/ui primitives (22 components)
│       ├── hooks/                  # Custom React hooks
│       │   ├── useScore.ts         # React Query mutations for scoring
│       │   └── useInterval.ts      # Polling hook
│       ├── lib/
│       │   ├── auth.ts             # NextAuth config (real backend + demo fallback)
│       │   ├── api.ts              # Axios client with JWT interceptor
│       │   ├── demoStore.ts        # sessionStorage bridge for demo scores
│       │   └── validations.ts      # Zod schemas for form validation
│       └── .env.local              # Frontend env vars (gitignored)
│
├── scripts/
│   ├── setup_dev.sh                # One-command dev setup
│   ├── seed_db.py                  # Database seeder (50 sample applications)
│   └── generate_synthetic_data.py  # Synthetic dataset generator
│
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Template for .env
├── .gitignore
├── package.json                    # Root workspace config
├── turbo.json                      # Turborepo pipeline config
├── pnpm-workspace.yaml             # pnpm workspace definition
└── README.md
```

---

## 📊 Dashboard Pages

| Page | Route | Features |
|------|-------|----------|
| **Overview** | `/dashboard` | 4 metric cards (AUC, SHAP coverage, fairness, app count), score distribution chart, SHAP feature importance, recent scoring activity table, model performance panel |
| **New Application** | `/dashboard/new-application` | 3-step wizard: traditional credit data → alternative data (mobile, utility, rental) → fairness consent + demographic data. Submits to real ML backend for XGBoost scoring |
| **Score History** | `/dashboard/score-history` | Paginated table with risk tier badges, confidence intervals, dates. Click any row to view full score detail |
| **Score Detail** | `/dashboard/scores/[id]` | Animated score gauge (300-850), SHAP waterfall chart, 95% confidence interval bar, percentile comparison, model version, adverse action notices |
| **XAI Explorer** | `/dashboard/xai-explorer` | SHAP beeswarm visualization, LIME vs SHAP comparison, global feature importance ranking, interpretable vs black-box tradeoff |
| **Fairness Audit** | `/dashboard/fairness` | 4 fairness metrics (DPD, EOD, DIR, SPD), grouped bar chart by demographic, accuracy-fairness tradeoff analysis, mitigation strategies |
| **Drift Monitor** | `/dashboard/drift` | PSI gauges per feature, KS test results, AUC over time, drift timeline, admin retrain controls |
| **Model Registry** | `/dashboard/models` | Model version table, radar chart comparison, feature importance, promote-to-production workflow |
| **Settings** | `/dashboard/settings` | Profile management, security settings, GDPR privacy controls, notification preferences |

---

## 🗄 Database Schema

The PostgreSQL database contains 11 tables managed by SQLAlchemy/Alembic:

| Table | Key Columns | Description |
|-------|-------------|-------------|
| `users` | id, email, password_hash, role, is_active | User accounts with role-based access |
| `applications` | id, user_id, payment_history_pct, amounts_owed, credit_utilization_ratio, annual_income, ... | Credit application with 15+ feature columns |
| `scores` | id, application_id, score, probability_of_default, risk_tier, model_version, confidence_lower/upper | ML scoring results |
| `shap_values` | id, score_id, feature_name, shap_value, rank, direction | Per-feature SHAP explanations |
| `model_registry` | id, version, auc, precision, recall, is_active, train_date | Model version tracking |
| `fairness_reports` | id, score_id, demographic_parity_diff, equalized_odds_diff, disparate_impact_ratio | Fairness audit results |
| `drift_reports` | id, model_version, psi_score, features_drifted | Drift detection results |
| `audit_log` | id, user_id, action, details, timestamp | Admin audit trail |

---

## 🧪 Testing the Full Pipeline

### 1. Verify All Services Are Running

```bash
# API health check
curl http://localhost:8000/health
# → {"status":"ok"}

# ML health check
curl http://localhost:8001/health
# → {"status":"ok","routers_loaded":true}
```

### 2. Test End-to-End Scoring via CLI

```bash
# Login to get JWT
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@creditai.dev","password":"Demo123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# Submit application (creates Application + Score in DB, calls ML service)
curl -s -X POST http://localhost:8000/api/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "payment_history_pct": 92,
    "amounts_owed": 8500,
    "credit_utilization_pct": 25,
    "credit_length_months": 84,
    "new_inquiries_6m": 2,
    "credit_mix_count": 4,
    "annual_income": 78000,
    "employment_status": "employed",
    "zip_code": "94102",
    "age": 32
  }' | python3 -m json.tool

# Expected output:
# {
#   "score_id": "uuid",
#   "score": 735,
#   "risk_tier": "medium_low",
#   "probability_of_default": 0.209,
#   "shap_values": [...],
#   "adverse_action": {...},
#   "fairness_metrics": {...}
# }
```

### 3. Verify Database Persistence

```bash
# List all scores for the user
curl -s "http://localhost:8000/api/scores?skip=0&limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## 🐳 Docker (Alternative Setup)

```bash
docker-compose up
```

This starts all 3 services plus a local PostgreSQL and Redis instance.

---

## ⚠️ Known Issues & Notes

- **Python 3.9**: The ML service requires `from __future__ import annotations` in several files for type hint compatibility. This is already applied.
- **ML Dependencies**: Use `requirements-local.txt` instead of `requirements.txt` for local development. The full requirements include heavy packages (evidently, opacus, torch, sdv) that conflict with Pydantic v2.
- **Neon Cold Start**: The first API request after idle may be slow (~3s) due to Neon PostgreSQL serverless cold start.
- **FinBERT**: The NLP pipeline downloads the FinBERT model (~420MB) on first use. Requires a valid `HF_TOKEN`.
- **Demo Mode**: If the API backend is unreachable, the frontend falls back to demo-credential auth and client-side scoring. All features remain functional with synthetic data.

---

## 📝 Research References

1. Bücker, M. et al. (2022). "Transparency, auditability, and explainability of machine learning models in credit scoring." *Journal of the Operational Research Society*, 73(1), 70-90.

2. Hurlin, C. et al. (2024). "Fairness in Credit Scoring: Assessment, Implementation and Profit Implications." *European Journal of Operational Research*.

3. Gunnarsson, B.R. et al. (2021). "Deep learning for credit scoring: Do or don't." *European Journal of Operational Research*, 295(1), 292-305.

4. Dastile, X. et al. (2020). "Statistical and machine learning models in credit scoring: A systematic literature survey." *Applied Soft Computing*, 91, 106263.

5. Bussmann, N. et al. (2021). "Explainable Machine Learning in Credit Risk Management." *Computational Economics*, 57, 203-216.

6. Misheva, B.H. et al. (2021). "Explainable AI in credit risk management." *arXiv preprint arXiv:2103.00949*.

7. Weber, P. et al. (2023). "Applications of Explainable Artificial Intelligence in Finance." *Information Fusion*, 99, 101934.

---

## ⚠️ Academic Use Notice

This project was developed as a research implementation for **CPSC 589 at California State University, Fullerton**. It demonstrates state-of-the-art approaches to explainable and fair AI in credit scoring, intended for academic and research purposes.

**Not intended for production lending decisions without proper regulatory review.**

---

<p align="center">
  <strong>CreditAI</strong> · CPSC 589 · Tirth Isamaliya · Dr. Kenneth Kung · CSUF
</p>
