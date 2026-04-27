#!/bin/bash
set -e

echo "╔══════════════════════════════════════════╗"
echo "║       CreditAI — Development Setup       ║"
echo "║       CPSC 589 · Tirth Isamaliya          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Prerequisites ──
command -v node >/dev/null 2>&1 || { echo "❌ Node.js 20+ required. Install from https://nodejs.org"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3.11+ required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required. Install from https://docker.com"; exit 1; }

if ! command -v pnpm &>/dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi

# ── Root dependencies ──
echo ""
echo "📦 Installing Node.js dependencies..."
pnpm install

# ── API Python environment ──
echo ""
echo "🐍 Setting up API Python environment..."
cd apps/api
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
deactivate
cd ../..

# ── ML Python environment ──
echo ""
echo "🧠 Setting up ML service Python environment..."
cd apps/ml
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q torch==2.1.2 --index-url https://download.pytorch.org/whl/cpu 2>/dev/null || echo "⚠ torch install skipped (may already exist)"
pip install -q torch-geometric 2>/dev/null || echo "⚠ torch-geometric install skipped"
pip install -q -r requirements.txt
deactivate
cd ../..

# ── Environment file ──
if [ ! -f ".env" ]; then
  echo ""
  echo "📋 Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠ Edit .env with your credentials before running the app"
fi

# ── Docker services ──
echo ""
echo "🐳 Starting Docker services (postgres, redis)..."
docker-compose up -d postgres redis 2>/dev/null || docker compose up -d postgres redis 2>/dev/null || echo "⚠ Docker services not started — using remote DB"
sleep 4

# ── Database migrations ──
echo ""
echo "🗄️ Running database migrations..."
cd apps/api
source venv/bin/activate
alembic upgrade head 2>/dev/null || echo "⚠ Migrations skipped (run manually: cd apps/api && alembic upgrade head)"

# ── Seed data ──
echo ""
echo "🌱 Seeding database..."
python ../../scripts/seed_db.py --direct 2>/dev/null || echo "⚠ Seed skipped (run manually: python scripts/seed_db.py --direct)"
deactivate
cd ../..

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║            ✅ Setup Complete!              ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "  Start the app with 3 terminals:"
echo ""
echo "  Terminal 1 (API):"
echo "    cd apps/api && source venv/bin/activate"
echo "    uvicorn main:app --reload --port 8000"
echo ""
echo "  Terminal 2 (ML):"
echo "    cd apps/ml && source venv/bin/activate"
echo "    uvicorn main:app --reload --port 8001"
echo ""
echo "  Terminal 3 (Web):"
echo "    cd apps/web && pnpm dev"
echo ""
echo "  Open: http://localhost:3000"
echo "  Demo: demo@creditai.dev / Demo123!"
echo "  Admin: admin@creditai.dev / Admin123!"
echo ""
