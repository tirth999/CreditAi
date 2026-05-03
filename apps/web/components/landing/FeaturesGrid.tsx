"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const FEATURES = [
  {
    number: "01",
    label: "MONITORING",
    title: "Real-time Score Monitoring",
    body: "Track your credit score across all three bureaus with real-time alerts on any changes or inquiries.",
  },
  {
    number: "02",
    label: "DISPUTES",
    title: "AI Dispute Letter Generator",
    body: "Generate legally-compliant dispute letters powered by machine learning. Bureau-specific formatting included.",
  },
  {
    number: "03",
    label: "ANALYSIS",
    title: "Credit Factor Breakdown",
    body: "Understand exactly what impacts your score. Payment history, utilization, age — all weighted and explained.",
  },
  {
    number: "04",
    label: "OPTIMIZATION",
    title: "Utilization Optimizer",
    body: "Get precise recommendations on how to redistribute balances across cards for maximum score impact.",
  },
  {
    number: "05",
    label: "SECURITY",
    title: "Identity Theft Alerts",
    body: "Dark web monitoring and real-time alerts when your personal information appears in new credit applications.",
  },
  {
    number: "06",
    label: "SIMULATION",
    title: "Score Simulator",
    body: "Model the impact of financial decisions before you make them. Pay off a card, open a new account — see the result.",
  },
]

export default function FeaturesGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.05,
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="features"
      style={{
        background: "var(--bg-void)",
        padding: "120px 5vw",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>
          FEATURES
        </div>
        <h2 className="t-section" style={{ marginBottom: 60 }}>
          Everything You Need
        </h2>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1, // 1px gap acts as grid lines
            background: "var(--border)",
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.number}
              className="feature-card"
              style={{
                background: "var(--bg-surface)",
                padding: "2rem",
                cursor: "default",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-surface)"
              }}
            >
              {/* Eyebrow label */}
              <div className="t-card-label" style={{ marginBottom: 20 }}>
                {feature.label}
              </div>

              {/* Large number */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {feature.number}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: 24,
                  color: "var(--text-primary)",
                  marginBottom: 12,
                  fontWeight: 400,
                }}
              >
                {feature.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "var(--text-secondary)",
                }}
              >
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
