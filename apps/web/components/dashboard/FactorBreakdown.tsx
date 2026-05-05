"use client"

const FEATURES = [
  { label: "Annual Income", value: 0.34, max: 0.40 },
  { label: "Debt-to-Income Ratio", value: 0.28, max: 0.40 },
  { label: "Credit History Length", value: 0.18, max: 0.40 },
  { label: "Open Accounts", value: 0.12, max: 0.40 },
  { label: "Recent Inquiries", value: 0.08, max: 0.40 },
]

/**
 * Feature importance breakdown — SHAP values
 * Horizontal bars with normalized SHAP magnitudes
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
        FEATURE IMPORTANCE — SHAP
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {FEATURES.map((feature) => (
          <div key={feature.label}>
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
                {feature.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {feature.value.toFixed(2)}
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
                  width: `${(feature.value / feature.max) * 100}%`,
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
