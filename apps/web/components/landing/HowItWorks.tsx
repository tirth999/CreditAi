"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const NeuralNetwork = dynamic(() => import("@/components/three/NeuralNetwork"), { ssr: false })

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const STEPS = [
  {
    number: "01",
    title: "Submit Application Data",
    description:
      "Enter traditional credit features — payment history, utilization, account age — alongside alternative data such as utility payments and rental history for thin-file applicants.",
    side: "left" as const,
  },
  {
    number: "02",
    title: "Neural Ensemble Scoring",
    description:
      "A deep neural ensemble, benchmarked against EBM and logistic regression baselines, generates a credit risk score with MAPIE conformal prediction intervals for calibrated uncertainty.",
    side: "right" as const,
    has3D: true,
  },
  {
    number: "03",
    title: "Explainability & Fairness Report",
    description:
      "Receive a full SHAP waterfall, LIME comparison, feature-importance ranking, and an AIF360/Fairlearn fairness audit — all exportable as a PDF adverse-action notice.",
    side: "left" as const,
  },
]

function GeometricIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 30 + 4}
            y={row * 30 + 4}
            width={22}
            height={22}
            stroke="var(--text-tertiary)"
            strokeWidth="1"
            fill="none"
            opacity={(row + col) % 3 === 0 ? 0.8 : 0.3}
          />
        ))
      )}
    </svg>
  )
}

function ScoreCardMockup() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        padding: 24,
        maxWidth: 280,
      }}
    >
      <div className="t-card-label" style={{ marginBottom: 12 }}>
        RISK SCORE
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 48,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        742
      </div>
      <div
        className="t-eyebrow"
        style={{ marginBottom: 20, color: "var(--success)" }}
      >
        +12 THIS MONTH
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {["SHAP Impact", "Confidence", "Fairness"].map((label) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" }}>
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-primary)",
              }}
            >
              {label === "SHAP Impact" ? "+0.34" : label === "Confidence" ? "95%" : "0.92"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepBlock({
  step,
  index,
}: {
  step: (typeof STEPS)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [])

  const isLeft = step.side === "left"

  const contentBlock = (
    <div style={{ flex: 1, padding: "0 24px" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(60px, 8vw, 80px)",
          color: "var(--text-tertiary)",
          lineHeight: 0.9,
          marginBottom: 20,
        }}
      >
        {step.number}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-editorial)",
          fontSize: "clamp(24px, 3vw, 32px)",
          color: "var(--text-primary)",
          marginBottom: 16,
          fontStyle: index % 2 !== 0 ? "italic" : "normal",
        }}
      >
        {step.title}
      </h3>
      <p className="t-body" style={{ maxWidth: 400 }}>
        {step.description}
      </p>
    </div>
  )

  const visualBlock = (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
      }}
    >
      {step.has3D ? (
        <div style={{ width: 300, height: 200 }} aria-hidden="true">
          <NeuralNetwork width={300} height={200} />
        </div>
      ) : index === 0 ? (
        <GeometricIcon />
      ) : (
        <ScoreCardMockup />
      )}
    </div>
  )

  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          flexDirection: isLeft ? "row" : "row-reverse",
          alignItems: "center",
          gap: 40,
          padding: "80px 0",
        }}
      >
        {contentBlock}
        {visualBlock}
      </div>
      {index < STEPS.length - 1 && <div className="divider" />}
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "var(--bg-void)",
        padding: "80px 5vw",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>
          HOW IT WORKS
        </div>
        <h2
          className="t-section t-section--italic"
          style={{ marginBottom: 60 }}
        >
          Three Steps
        </h2>

        {STEPS.map((step, i) => (
          <StepBlock key={step.number} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}
