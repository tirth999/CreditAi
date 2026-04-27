<p align="center">
  <img src="https://img.shields.io/badge/CPSC_589-Research_Project-gold?style=for-the-badge" alt="CPSC 589" />
  <img src="https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/XGBoost-FF6600?style=for-the-badge" alt="XGBoost" />
  <img src="https://img.shields.io/badge/SHAP-purple?style=for-the-badge" alt="SHAP" />
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
│  │NextAuth  │ │+ Queue   │ │Audit     │ │Admin/Audit       │ │
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

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Dashboard, SSR, routing |
| **UI** | shadcn/ui, Radix, Tailwind CSS | Component library, accessibility |
| **Charts** | D3.js, Recharts | Score gauge, SHAP waterfall/beeswarm, drift timeline |
| **State** | Zustand, React Query | Client state, server cache |
| **Auth** | NextAuth v5 (beta) | OAuth, JWT sessions |
| **API** | FastAPI, Pydantic v2 | REST endpoints, validation |
| **Database** | PostgreSQL (Neon), SQLAlchemy 2.0 | Async ORM, migrations (Alembic) |
| **Cache** | Upstash Redis (REST), local Redis (TCP) | Session cache, Celery broker |
| **ML** | XGBoost, scikit-learn, MAPIE | Credit scoring, conformal prediction |
| **XAI** | SHAP, LIME | Model explainability |
| **Fairness** | AIF360, Fairlearn | Bias detection, mitigation |
| **NLP** | FinBERT (HuggingFace) | Financial narrative analysis |
| **Drift** | PSI, KS test, custom monitors | Feature drift detection |
| **PDF** | @react-pdf/renderer | Score report export |
| **Task Queue** | Celery + Redis | Async scoring, retrain jobs |
| **Deploy** | Docker, Railway, Vercel | Container + cloud deployment |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/tirth999/CreditAi.git
cd CreditAi

# 2. Setup (installs deps, creates venvs, seeds DB)
chmod +x scripts/setup_dev.sh
./scripts/setup_dev.sh

# 3. Open
open http://localhost:3000
```

---

## 🖥 Running the App

### Option A: Three Terminals

```bash
# Terminal 1 — API Server
cd apps/api
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2 — ML Microservice
cd apps/ml
source venv/bin/activate
uvicorn main:app --reload --port 8001

# Terminal 3 — Next.js Frontend
cd apps/web
pnpm dev
```

### Option B: Docker Compose

```bash
docker-compose up
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@creditai.dev` | `Admin123!` |
| **Demo User** | `demo@creditai.dev` | `Demo123!` |

---

## 📖 API Documentation

| Service | URL | Docs |
|---------|-----|------|
| **API** | `http://localhost:8000` | [Swagger UI](http://localhost:8000/docs) |
| **ML** | `http://localhost:8001` | [Swagger UI](http://localhost:8001/docs) |

### Key Endpoints

```
POST /api/auth/register          — Register new user
POST /api/auth/login             — Get JWT token
POST /api/score                  — Submit credit application (returns job_id)
GET  /api/score/status/{job_id}  — Poll scoring status
GET  /api/score/{id}             — Get score with SHAP values
GET  /api/fairness/{score_id}    — Fairness report for a score
GET  /api/fairness/aggregate     — Aggregate fairness metrics
GET  /api/drift/latest           — Latest drift report
POST /api/drift/retrain          — Trigger model retrain (admin)
GET  /api/models                 — List model registry
POST /api/models/promote         — Promote model to production (admin)
GET  /api/admin/health           — System health check (admin)
```

---

## 📁 Project Structure

```
CreditAi/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── core/               # Config, database, deps, security
│   │   ├── models/             # SQLAlchemy models (11 tables)
│   │   ├── routers/            # API route handlers
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic
│   │   ├── tasks/              # Celery async tasks
│   │   └── migrations/         # Alembic migrations
│   ├── ml/                     # ML microservice
│   │   ├── models/             # XGBoost, EBM, LogReg
│   │   ├── explainers/         # SHAP, LIME
│   │   ├── fairness/           # AIF360, Fairlearn
│   │   ├── nlp/                # FinBERT pipeline
│   │   └── data/               # Dataset loaders
│   └── web/                    # Next.js 14 frontend
│       ├── app/                # App Router pages
│       │   ├── (public)/       # Landing, login, register
│       │   └── (protected)/    # Dashboard pages (10 pages)
│       ├── components/         # React components
│       │   ├── charts/         # D3/Recharts (7 components)
│       │   ├── score/          # Score display (4 components)
│       │   ├── forms/          # Application form
│       │   ├── layout/         # Sidebar, topbar
│       │   └── ui/             # shadcn/ui primitives (22 components)
│       ├── hooks/              # React Query hooks
│       ├── lib/                # Auth, API client, utils
│       └── store/              # Zustand stores
├── scripts/                    # Dev tooling
│   ├── seed_db.py              # Database seeder
│   ├── setup_dev.sh            # One-command dev setup
│   └── generate_synthetic_data.py
├── docker-compose.yml
└── README.md
```

---

## 📊 Dashboard Pages

| Page | Route | Features |
|------|-------|----------|
| **Overview** | `/dashboard` | 4 metric cards, score history chart, recent applications table |
| **New Application** | `/dashboard/new-application` | 3-step form (traditional → alt data → fairness), async scoring |
| **Score History** | `/dashboard/scores` | Paginated table, sort/filter, risk tier badges |
| **Score Detail** | `/dashboard/scores/[id]` | Score gauge (D3), SHAP waterfall, confidence interval, percentile bars, PDF export |
| **XAI Explorer** | `/dashboard/xai-explorer` | SHAP beeswarm (D3), LIME vs SHAP, interpretable vs black-box, global importance |
| **Fairness Audit** | `/dashboard/fairness` | 4 fairness metrics, grouped bar chart, accuracy-fairness tradeoff, mitigation strategies |
| **Drift Monitor** | `/dashboard/drift` | PSI gauges, timeline chart, KS test table, AUC over time, admin retrain controls |
| **Model Registry** | `/dashboard/models` | Model table, radar chart comparison, feature importance, promote-to-production |
| **Admin** | `/dashboard/admin` | User management, audit log, system health |
| **Settings** | `/dashboard/settings` | Profile, security, GDPR privacy controls, notifications |

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
