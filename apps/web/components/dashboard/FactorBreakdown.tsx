"use client"

const FACTORS = [
  { label: "Payment History", value: 95, max: 100 },
  { label: "Amounts Owed", value: 72, max: 100 },
  { label: "Credit History", value: 85, max: 100 },
  { label: "New Credit", value: 90, max: 100 },
  { label: "Credit Mix", value: 68, max: 100 },
]

/**
 * Factor breakdown — 5 horizontal CSS bars
 * Label left, bar track center, value right
 */
export function FactorBreakdown() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 0,
        padding: "1.5rem",
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
          marginBottom: 24,
        }}
      >
        FACTOR BREAKDOWN
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {FACTORS.map((factor) => (
          <div key={factor.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                {factor.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {factor.value}%
              </span>
            </div>
            {/* Bar track */}
            <div
              style={{
                width: "100%",
                height: 4,
                background: "var(--bg-hover)",
                position: "relative",
              }}
            >
              {/* Bar fill */}
              <div
                style={{
                  width: `${(factor.value / factor.max) * 100}%`,
                  height: "100%",
                  background: "var(--accent)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
