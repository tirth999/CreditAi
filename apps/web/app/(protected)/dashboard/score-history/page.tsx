"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { getDemoScores } from "@/lib/demoStore"
import Link from "next/link"

const ScoreDistribution = dynamic(
  () => import("@/components/charts/ScoreDistribution"),
  { ssr: false }
)

const TABS = ["3M", "6M", "1Y", "ALL"]

const MOCK_EVENTS = [
  { date: "2026-05-01", application: "APP-2847", score: 748, tier: "Low Risk", confidence: "±12", id: "" },
  { date: "2026-04-28", application: "APP-2846", score: 618, tier: "Medium Risk", confidence: "±18", id: "" },
  { date: "2026-04-25", application: "APP-2845", score: 789, tier: "Low Risk", confidence: "±8", id: "" },
  { date: "2026-04-20", application: "APP-2844", score: 485, tier: "High Risk", confidence: "±24", id: "" },
  { date: "2026-04-18", application: "APP-2843", score: 756, tier: "Low Risk", confidence: "±10", id: "" },
  { date: "2026-04-12", application: "APP-2842", score: 692, tier: "Medium Risk", confidence: "±14", id: "" },
  { date: "2026-04-05", application: "APP-2841", score: 534, tier: "High Risk", confidence: "±22", id: "" },
  { date: "2026-03-28", application: "APP-2840", score: 811, tier: "Low Risk", confidence: "±6", id: "" },
]

export default function ScoreHistoryPage() {
  const [activeTab, setActiveTab] = useState("1Y")
  const [events, setEvents] = useState(MOCK_EVENTS)

  useEffect(() => {
    const demoScores = getDemoScores()
    if (demoScores.length > 0) {
      const demoEvents = demoScores.map(s => ({
        date: s.date,
        application: `APP-${s.id.slice(-4)}`,
        score: s.score,
        tier: s.risk_tier === "Low" ? "Low Risk" : s.risk_tier === "High" ? "High Risk" : "Medium Risk",
        confidence: s.confidence,
        id: s.id,
      }))
      setEvents([...demoEvents, ...MOCK_EVENTS])
    }
  }, [])

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
        {events.map((event, i) => {
          const isDemo = !!event.id
          const Wrapper = isDemo ? Link : "div" as any
          const wrapperProps = isDemo ? { href: `/dashboard/scores/${event.id}` } : {}

          return (
            <Wrapper
              key={event.application + i}
              {...wrapperProps}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 0.8fr",
                padding: "12px 1.5rem",
                borderBottom: i < events.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.12s ease",
                textDecoration: "none",
                color: "inherit",
                cursor: isDemo ? "pointer" : "default",
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.background = "var(--bg-hover)"
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.background = "transparent"
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" }}>
                {event.date}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: isDemo ? "var(--accent, #D4B47A)" : "var(--text-primary)" }}>
                {event.application}
                {isDemo && <span style={{ fontSize: 9, marginLeft: 6, opacity: 0.5 }}>NEW</span>}
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
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}
