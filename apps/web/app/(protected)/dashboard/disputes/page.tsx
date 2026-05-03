"use client"

import { useState } from "react"

const OPEN_DISPUTES = [
  {
    bureau: "EXPERIAN",
    account: "Capital One Platinum",
    reason: "Incorrect late payment reported",
    status: "IN REVIEW",
    daysRemaining: 23,
    filed: "Apr 10, 2026",
  },
  {
    bureau: "EQUIFAX",
    account: "Medical Collections — ABC Health",
    reason: "Paid collection not updated",
    status: "IN REVIEW",
    daysRemaining: 15,
    filed: "Apr 18, 2026",
  },
  {
    bureau: "TRANSUNION",
    account: "Sprint Account #4892",
    reason: "Account does not belong to me",
    status: "IN REVIEW",
    daysRemaining: 29,
    filed: "Apr 4, 2026",
  },
]

const RESOLVED_DISPUTES = [
  {
    bureau: "EXPERIAN",
    account: "Comcast Account",
    reason: "Duplicate entry",
    status: "WON",
    resolved: "Mar 22, 2026",
    impact: "+18 points",
  },
  {
    bureau: "EQUIFAX",
    account: "Wells Fargo Auto",
    reason: "Incorrect balance reported",
    status: "WON",
    resolved: "Mar 10, 2026",
    impact: "+12 points",
  },
  {
    bureau: "TRANSUNION",
    account: "AT&T Account",
    reason: "Settled debt not reflected",
    status: "CLOSED",
    resolved: "Feb 28, 2026",
    impact: "No change",
  },
]

function DisputeCard({
  dispute,
  resolved = false,
}: {
  dispute: (typeof OPEN_DISPUTES)[0] | (typeof RESOLVED_DISPUTES)[0]
  resolved?: boolean
}) {
  const d = dispute as any
  const statusClass =
    d.status === "WON" ? "pill pill--won" : d.status === "CLOSED" ? "pill pill--closed" : "pill"

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 0,
        padding: "1.5rem",
        transition: "border-color 0.12s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-lit)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)"
      }}
    >
      {/* Bureau badge + status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "var(--accent)",
            color: "var(--bg-void)",
            padding: "3px 8px",
          }}
        >
          {d.bureau}
        </span>
        <span className={statusClass}>{d.status}</span>
      </div>

      {/* Account */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: 6,
        }}
      >
        {d.account}
      </div>

      {/* Reason */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: 16,
          lineHeight: 1.6,
        }}
      >
        {d.reason}
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid var(--border)",
          paddingTop: 12,
        }}
      >
        {!resolved ? (
          <>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>
              Filed: {d.filed}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {d.daysRemaining}d
            </span>
          </>
        ) : (
          <>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>
              Resolved: {d.resolved}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                color: d.impact.includes("+") ? "var(--success)" : "var(--text-tertiary)",
              }}
            >
              {d.impact}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default function DisputesPage() {
  const [showNewDispute, setShowNewDispute] = useState(false)

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>
            CREDIT BUREAU DISPUTES
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)" }}>
            {OPEN_DISPUTES.length} open · {RESOLVED_DISPUTES.filter((d) => d.status === "WON").length} won ·{" "}
            {RESOLVED_DISPUTES.filter((d) => d.status === "CLOSED").length} closed
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowNewDispute(!showNewDispute)}>
          + NEW DISPUTE
        </button>
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Open */}
        <div>
          <div className="t-card-label" style={{ marginBottom: 16 }}>
            OPEN DISPUTES ({OPEN_DISPUTES.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }}>
            {OPEN_DISPUTES.map((d, i) => (
              <DisputeCard key={i} dispute={d} />
            ))}
          </div>
        </div>

        {/* Resolved */}
        <div>
          <div className="t-card-label" style={{ marginBottom: 16 }}>
            RESOLVED ({RESOLVED_DISPUTES.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }}>
            {RESOLVED_DISPUTES.map((d, i) => (
              <DisputeCard key={i} dispute={d} resolved />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
