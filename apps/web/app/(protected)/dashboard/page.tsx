"use client"

import { Suspense, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { FactorBreakdown } from "@/components/dashboard/FactorBreakdown"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { ModelPerformanceCard } from "@/components/dashboard/AIAdvisorCard"
import { getDemoScores } from "@/lib/demoStore"

const ScoreDistribution = dynamic(
  () => import("@/components/charts/ScoreDistribution"),
  { ssr: false }
)

export default function DashboardPage() {
  const [appCount, setAppCount] = useState(1247)

  useEffect(() => {
    const demoScores = getDemoScores()
    setAppCount(1247 + demoScores.length)
  }, [])
  return (
    <div>
      {/* Row 1 — 4 metric cards */}
      <div
        className="dashboard-metrics"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "var(--border)",
          marginBottom: 24,
        }}
      >
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="Model AUC"
            value="0.847"
            delta="+0.012 from v2.3"
            deltaPositive={true}
          />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="SHAP Coverage"
            value="94.2%"
            sub="All features explained"
          />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="Fairness Score"
            value="0.91"
            sub="Demographic parity"
          />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="Applications Scored"
            value={appCount.toLocaleString()}
            delta={`+${getDemoScores().length || 89} recent`}
            deltaPositive={true}
          />
        </div>
      </div>

      {/* Row 2 — Score Distribution (8 cols) + Feature Importance (4 cols) */}
      <div
        className="dashboard-grid-2-1"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 1,
          background: "var(--border)",
          marginBottom: 24,
        }}
      >
        {/* Score Distribution Chart */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 0,
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: 16,
            }}
          >
            SCORE DISTRIBUTION — ALL APPLICANTS
          </div>
          <Suspense
            fallback={
              <div
                style={{
                  width: "100%",
                  height: 320,
                  background: "var(--bg-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                }}
              >
                LOADING CHART...
              </div>
            }
          >
            <ScoreDistribution />
          </Suspense>
        </div>

        {/* Feature Importance */}
        <div style={{ background: "var(--bg-void)" }}>
          <FactorBreakdown />
        </div>
      </div>

      {/* Row 3 — Recent Activity (8 cols) + Model Performance (4 cols) */}
      <div
        className="dashboard-grid-2-1"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 1,
          background: "var(--border)",
        }}
      >
        <div style={{ background: "var(--bg-void)" }}>
          <RecentActivity />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <ModelPerformanceCard />
        </div>
      </div>
    </div>
  )
}
