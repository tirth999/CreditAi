"use client"

const ACTIVITIES = [
  { account: "Chase Sapphire", change: "+15", date: "May 1, 2026", impact: "Positive", isPositive: true },
  { account: "Amex Gold", change: "-3", date: "Apr 28, 2026", impact: "Minor", isPositive: false },
  { account: "Capital One", change: "+8", date: "Apr 25, 2026", impact: "Positive", isPositive: true },
  { account: "Discover It", change: "+22", date: "Apr 20, 2026", impact: "Significant", isPositive: true },
  { account: "Wells Fargo", change: "-7", date: "Apr 18, 2026", impact: "Moderate", isPositive: false },
]

/**
 * Recent activity table — minimal, horizontal 1px dividers only
 */
export function RecentActivity() {
  return (
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
          padding: "1.5rem 1.5rem 1rem",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        RECENT ACTIVITY
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 0.8fr 1.2fr 1fr",
          padding: "8px 1.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {["Account", "Change", "Date", "Impact"].map((h) => (
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
      {ACTIVITIES.map((activity, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 0.8fr 1.2fr 1fr",
            padding: "12px 1.5rem",
            borderBottom: i < ACTIVITIES.length - 1 ? "1px solid var(--border)" : "none",
            transition: "background 0.12s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-primary)",
            }}
          >
            {activity.account}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              fontWeight: 700,
              color: activity.isPositive ? "var(--success)" : "var(--error)",
            }}
          >
            {activity.change}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            {activity.date}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            {activity.impact}
          </div>
        </div>
      ))}
    </div>
  )
}
