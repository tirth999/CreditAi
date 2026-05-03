"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"

const ScoreChart = dynamic(
  () =>
    import("@/components/three/BarChart3D").then((mod) => {
      const { BarChart3D } = mod
      const { Canvas } = require("@react-three/fiber")

      function FullChart() {
        return (
          <div style={{ width: "100%", height: 500 }} aria-hidden="true">
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
      return { default: FullChart }
    }),
  { ssr: false }
)

const TABS = ["3M", "6M", "1Y", "ALL"]

const SCORE_EVENTS = [
  { date: "2026-05-01", score: 748, event: "Payment recorded", change: "+6" },
  { date: "2026-04-15", score: 742, event: "Utilization decreased", change: "+4" },
  { date: "2026-04-01", score: 738, event: "Account age milestone", change: "+3" },
  { date: "2026-03-15", score: 735, event: "Hard inquiry", change: "-5" },
  { date: "2026-03-01", score: 740, event: "Payment recorded", change: "+8" },
  { date: "2026-02-15", score: 732, event: "Balance paid down", change: "+7" },
  { date: "2026-02-01", score: 725, event: "New account opened", change: "-3" },
  { date: "2026-01-15", score: 728, event: "Payment recorded", change: "+6" },
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

      {/* Full-width 3D chart */}
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
                height: 500,
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
          <ScoreChart />
        </Suspense>
      </div>

      {/* Score events table */}
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
            gridTemplateColumns: "1.2fr 0.8fr 2fr 0.8fr",
            padding: "10px 1.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Date", "Score", "Event", "Change"].map((h) => (
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
              gridTemplateColumns: "1.2fr 0.8fr 2fr 0.8fr",
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
              {event.score}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)" }}>
              {event.event}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                color: event.change.startsWith("+") ? "var(--success)" : "var(--error)",
              }}
            >
              {event.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
