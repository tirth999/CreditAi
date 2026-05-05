"use client"

import { useState, useEffect } from "react"
import { getDemoScores } from "@/lib/demoStore"
import Link from "next/link"

const MOCK_APPLICATIONS = [
  { id: "APP-2847", tier: "Low Risk", score: 742, confidence: "±12", date: "May 1, 2026", tierColor: "var(--success)" },
  { id: "APP-2846", tier: "Medium Risk", score: 618, confidence: "±18", date: "Apr 28, 2026", tierColor: "#FFB340" },
  { id: "APP-2845", tier: "Low Risk", score: 789, confidence: "±8", date: "Apr 25, 2026", tierColor: "var(--success)" },
  { id: "APP-2844", tier: "High Risk", score: 485, confidence: "±24", date: "Apr 20, 2026", tierColor: "var(--error)" },
  { id: "APP-2843", tier: "Low Risk", score: 756, confidence: "±10", date: "Apr 18, 2026", tierColor: "var(--success)" },
]

function tierColor(tier: string) {
  if (tier === "Low" || tier === "Low Risk") return "var(--success)"
  if (tier === "High" || tier === "High Risk") return "var(--error)"
  return "#FFB340"
}

export function RecentActivity() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)

  useEffect(() => {
    const demoScores = getDemoScores()
    if (demoScores.length > 0) {
      const demoRows = demoScores.map((s, i) => ({
        id: s.id,
        tier: s.risk_tier === "Low" ? "Low Risk" : s.risk_tier === "High" ? "High Risk" : "Medium Risk",
        score: s.score,
        confidence: s.confidence,
        date: s.date,
        tierColor: tierColor(s.risk_tier),
      }))
      setApplications([...demoRows, ...MOCK_APPLICATIONS].slice(0, 8))
    }
  }, [])

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1.5rem 1.5rem 1rem",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        RECENT SCORING ACTIVITY
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 0.8fr 0.8fr 1.2fr",
          padding: "8px 1.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {["Application", "Risk Tier", "Score", "Confidence", "Date"].map((h) => (
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

      {applications.map((app, i) => {
        const isDemo = app.id.startsWith("demo-")
        const Row = isDemo ? Link : "div"
        const rowProps = isDemo ? { href: `/dashboard/scores/${app.id}` } : {}

        return (
          <Row
            key={app.id + i}
            {...(rowProps as any)}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.8fr 0.8fr 1.2fr",
              padding: "12px 1.5rem",
              borderBottom: i < applications.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.12s ease",
              cursor: isDemo ? "pointer" : "default",
              textDecoration: "none",
              color: "inherit",
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = "var(--bg-hover)"
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: isDemo ? "var(--accent, #D4B47A)" : "var(--text-primary)",
              }}
            >
              {isDemo ? `APP-${app.id.slice(-4)}` : app.id}
              {isDemo && <span style={{ fontSize: 9, marginLeft: 6, opacity: 0.5 }}>NEW</span>}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: app.tierColor,
                fontWeight: 500,
              }}
            >
              {app.tier}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {app.score}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              {app.confidence}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-secondary)",
              }}
            >
              {app.date}
            </div>
          </Row>
        )
      })}
    </div>
  )
}
