"use client"

interface MetricCardProps {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  sub?: string
}

/**
 * Dashboard metric card
 * Label: 11px Syne caps
 * Value: Space Mono 40px
 * Delta: 12px, color-coded green/red
 */
export function MetricCard({ label, value, delta, deltaPositive, sub }: MetricCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 0,
        padding: "1.5rem",
        transition: "border-color 0.12s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-lit)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)"
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 12,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 40,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>

      {/* Delta + Sub */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {delta && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
              color: deltaPositive ? "var(--success)" : "var(--error)",
            }}
          >
            {delta}
          </span>
        )}
        {sub && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}
