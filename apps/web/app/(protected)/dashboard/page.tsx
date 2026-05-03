"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { FactorBreakdown } from "@/components/dashboard/FactorBreakdown"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { AIAdvisorCard } from "@/components/dashboard/AIAdvisorCard"

const ScoreChart = dynamic(
  () =>
    import("@/components/three/BarChart3D").then((mod) => {
      // Wrap BarChart3D in a Canvas for dashboard usage
      const { BarChart3D } = mod
      const { Canvas } = require("@react-three/fiber")

      function ScoreChartCanvas() {
        return (
          <div style={{ width: "100%", height: 320 }} aria-hidden="true">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)}
              style={{ background: "transparent" }}
            >
              <BarChart3D />
            </Canvas>
          </div>
        )
      }
      return { default: ScoreChartCanvas }
    }),
  { ssr: false }
)

export default function DashboardPage() {
  return (
    <div>
      {/* Row 1 — 4 metric cards */}
      <div
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
            label="Current Score"
            value="742"
            delta="+12 this month"
            deltaPositive={true}
          />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="Payment History"
            value="98%"
            sub="On time"
          />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="Utilization"
            value="24%"
            sub="Optimal range"
          />
        </div>
        <div style={{ background: "var(--bg-void)" }}>
          <MetricCard
            label="Credit Age"
            value="7y 4m"
            sub="Good"
          />
        </div>
      </div>

      {/* Row 2 — Score History (8 cols) + Factor Breakdown (4 cols) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 1,
          background: "var(--border)",
          marginBottom: 24,
        }}
      >
        {/* Score History 3D Chart */}
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
            SCORE HISTORY — 12 MONTHS
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
            <ScoreChart />
          </Suspense>
        </div>

        {/* Factor Breakdown */}
        <div style={{ background: "var(--bg-void)" }}>
          <FactorBreakdown />
        </div>
      </div>

      {/* Row 3 — Recent Activity (8 cols) + AI Advisor (4 cols) */}
      <div
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
          <AIAdvisorCard />
        </div>
      </div>
    </div>
  )
}
