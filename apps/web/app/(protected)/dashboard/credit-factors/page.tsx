"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"

const FACTORS = [
  {
    name: "Payment History",
    score: 95,
    impact: "High",
    description: "Your payment history is excellent. 98% of payments made on time over the last 7 years.",
    tip: "Continue making all payments on time. Even one late payment can drop your score significantly.",
    steps: [
      "Set up autopay for minimum payments on all accounts",
      "Create calendar reminders 5 days before each due date",
      "Consider consolidating due dates to simplify tracking",
    ],
  },
  {
    name: "Amounts Owed",
    score: 72,
    impact: "High",
    description: "Your credit utilization is at 24%, which is in the optimal range. Keep it below 30%.",
    tip: "Paying down balances before the statement date can lower your reported utilization.",
    steps: [
      "Pay down Chase Sapphire balance from 34% to below 30%",
      "Request credit limit increase on Discover It card",
      "Spread charges across multiple cards to balance utilization",
    ],
  },
  {
    name: "Credit History",
    score: 85,
    impact: "Medium",
    description: "Average account age is 7 years 4 months. Your oldest account is 12 years old.",
    tip: "Keep your oldest accounts open, even if unused. Closing them shortens your average age.",
    steps: [
      "Keep your oldest credit card active with small recurring charges",
      "Avoid opening unnecessary new accounts",
      "Consider becoming an authorized user on a family member's older account",
    ],
  },
  {
    name: "New Credit",
    score: 90,
    impact: "Low",
    description: "Only 1 hard inquiry in the last 12 months. New account activity is minimal.",
    tip: "Rate shopping for mortgages or auto loans within a 14-45 day window counts as a single inquiry.",
    steps: [
      "Wait 6+ months between credit applications",
      "Use pre-qualification tools that do soft pulls",
      "Avoid store credit card offers at checkout",
    ],
  },
  {
    name: "Credit Mix",
    score: 68,
    impact: "Low",
    description: "You have 3 credit cards and 1 installment loan. A broader mix could help your score.",
    tip: "Having both revolving credit (cards) and installment loans (auto, mortgage) improves this factor.",
    steps: [
      "Consider a credit-builder loan if you lack installment credit",
      "Don't open new accounts solely for mix — only if you genuinely need them",
      "A secured card can add to mix without high risk",
    ],
  },
]

// CSS-only radar/polygon chart
function RadarChart({ factors }: { factors: typeof FACTORS }) {
  const size = 280
  const center = size / 2
  const radius = 110
  const angleStep = (Math.PI * 2) / factors.length

  // Calculate polygon points for the score shape
  const points = factors.map((f, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = (f.score / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  })

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ")

  // Axis lines
  const axes = factors.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    }
  })

  // Grid circles (3 levels)
  const gridLevels = [0.33, 0.66, 1]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid circles */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={factors
            .map((_, i) => {
              const angle = i * angleStep - Math.PI / 2
              const r = level * radius
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
            })
            .join(" ")}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {axes.map((axis, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={axis.x2}
          y2={axis.y2}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}

      {/* Score polygon */}
      <polygon
        points={pointsStr}
        fill="var(--accent)"
        fillOpacity="0.08"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />

      {/* Score dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--accent)" />
      ))}

      {/* Labels */}
      {factors.map((f, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelR = radius + 28
        const x = center + labelR * Math.cos(angle)
        const y = center + labelR * Math.sin(angle)
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fill: "var(--text-tertiary)",
            }}
          >
            {f.name.split(" ")[0]}
          </text>
        )
      })}
    </svg>
  )
}

function AccordionItem({
  factor,
  isOpen,
  onToggle,
}: {
  factor: (typeof FACTORS)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    if (isOpen) {
      gsap.fromTo(
        contentRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.25, ease: "expo.out" }
      )
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.2, ease: "expo.out" })
    }
  }, [isOpen])

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "16px 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "background 0.12s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-hover)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 18,
              color: "var(--text-primary)",
            }}
          >
            {factor.name}
          </span>
          <span className="pill" style={{ fontSize: 10 }}>
            {factor.impact} IMPACT
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {factor.score}%
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: "var(--text-tertiary)",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.15s step-end",
            }}
          >
            +
          </span>
        </div>
      </button>

      {/* Expandable content */}
      <div ref={contentRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div style={{ padding: "0 1.5rem 20px" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: 1.75,
              color: "var(--text-secondary)",
              marginBottom: 16,
            }}
          >
            {factor.description}
          </p>

          <div
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              padding: "12px 16px",
              marginBottom: 16,
            }}
          >
            <div className="t-card-label" style={{ marginBottom: 6 }}>
              TIP
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {factor.tip}
            </p>
          </div>

          <div className="t-card-label" style={{ marginBottom: 10 }}>
            HOW TO IMPROVE
          </div>
          <ol style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {factor.steps.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    minWidth: 20,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function CreditFactorsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* Left: Radar chart */}
      <div
        style={{
          flex: "0 0 340px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="t-card-label" style={{ marginBottom: 24, alignSelf: "flex-start" }}>
          FACTOR ANALYSIS
        </div>
        <RadarChart factors={FACTORS} />
        <div style={{ marginTop: 24, width: "100%" }}>
          {FACTORS.map((f) => (
            <div
              key={f.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" }}>
                {f.name}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                {f.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Accordion */}
      <div
        style={{
          flex: 1,
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <div className="t-card-label" style={{ padding: "1.5rem 1.5rem 0" }}>
          DETAILED BREAKDOWN
        </div>
        {FACTORS.map((factor, i) => (
          <AccordionItem
            key={factor.name}
            factor={factor}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}
