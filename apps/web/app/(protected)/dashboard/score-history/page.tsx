"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"

const ScoreDistribution = dynamic(
  () => import("@/components/charts/ScoreDistribution"),
  { ssr: false }
)

const TABS = ["3M", "6M", "1Y", "ALL"]

const SCORE_EVENTS = [
  { date: "2026-05-01", application: "APP-2847", score: 748, tier: "Low Risk", confidence: "±12" },
  { date: "2026-04-28", application: "APP-2846", score: 618, tier: "Medium Risk", confidence: "±18" },
  { date: "2026-04-25", application: "APP-2845", score: 789, tier: "Low Risk", confidence: "±8" },
  { date: "2026-04-20", application: "APP-2844", score: 485, tier: "High Risk", confidence: "±24" },
  { date: "2026-04-18", application: "APP-2843", score: 756, tier: "Low Risk", confidence: "±10" },
  { date: "2026-04-12", application: "APP-2842", score: 692, tier: "Medium Risk", confidence: "±14" },
  { date: "2026-04-05", application: "APP-2841", score: 534, tier: "High Risk", confidence: "±22" },
  { date: "2026-03-28", application: "APP-2840", score: 811, tier: "Low Risk", confidence: "±6" },
]

export default function ScoreHistoryPage() {
  const [activeTab, setActiveTab] = useState("1Y")

  return (
    <div>
      {/* Time range tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 24,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-tertiary)",
              cursor: "pointer",
              transition: "color 0.12s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Score Distribution Chart */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          padding: "1.5rem",
          marginBottom: 24,
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-tertiary)",
              }}
            >
              LOADING...
            </div>
          }
        >
          <ScoreDistribution />
        </Suspense>
      </div>

      {/* Scoring history table */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 0.8fr",
            padding: "10px 1.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Date", "Application", "Score", "Risk Tier", "Confidence"].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {SCORE_EVENTS.map((event, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 0.8fr",
              padding: "12px 1.5rem",
              borderBottom: i < SCORE_EVENTS.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.12s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" }}>
              {event.date}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {event.application}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {event.score}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                color: event.tier === "Low Risk" ? "var(--success)" : event.tier === "High Risk" ? "var(--error)" : "#FFB340",
              }}
            >
              {event.tier}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" }}>
              {event.confidence}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
