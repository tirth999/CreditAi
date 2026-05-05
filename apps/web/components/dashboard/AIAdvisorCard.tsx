"use client"

import Link from "next/link"

const METRICS = [
  { label: "Precision", value: "0.89" },
  { label: "Recall", value: "0.84" },
  { label: "F1 Score", value: "0.86" },
  { label: "AUC-ROC", value: "0.847" },
]

/**
 * Model performance sidebar card
 * Shows current production model version and key metrics
 */
export function ModelPerformanceCard() {
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
        MODEL PERFORMANCE
      </div>

      {/* Model version */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "var(--text-tertiary)",
            marginBottom: 6,
          }}
        >
          PRODUCTION MODEL
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          v2.4.1
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 4,
          }}
        >
          XGBoost Ensemble
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {METRICS.map((metric) => (
          <div key={metric.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              {metric.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Status indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 0",
          marginTop: 12,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            background: "var(--success)",
            borderRadius: "50%",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-secondary)",
          }}
        >
          Healthy — No drift detected
        </span>
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/models"
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: 12,
          fontSize: 13,
          padding: "10px 20px",
          textAlign: "center",
        }}
      >
        View Model Registry →
      </Link>
    </div>
  )
}
