"use client"

import Link from "next/link"

const RECOMMENDATIONS = [
  {
    priority: "HIGH",
    text: "Dispute outdated collection on Experian report — removed entries typically add 40-60 points.",
  },
  {
    priority: "MED",
    text: "Reduce Chase Sapphire utilization from 34% to below 30% by next billing cycle.",
  },
  {
    priority: "LOW",
    text: "Request credit limit increase on Discover It to improve overall utilization ratio.",
  },
]

/**
 * AI Advisor sidebar card
 * 3 numbered recommendations with priority badges
 */
export function AIAdvisorCard() {
  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: 0,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 20,
        }}
      >
        AI RECOMMENDATIONS
      </div>

      {/* Recommendations */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {RECOMMENDATIONS.map((rec, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            {/* Number */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-tertiary)",
                minWidth: 20,
                lineHeight: 1.5,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            <div>
              {/* Priority badge */}
              <span
                className={rec.priority === "HIGH" ? "pill pill--active" : "pill"}
                style={{ marginBottom: 6, display: "inline-block" }}
              >
                {rec.priority}
              </span>
              {/* Text */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  marginTop: 6,
                }}
              >
                {rec.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/ai-advisor"
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: 20,
          fontSize: 13,
          padding: "10px 20px",
          textAlign: "center",
        }}
      >
        Generate Dispute Letter →
      </Link>
    </div>
  )
}
