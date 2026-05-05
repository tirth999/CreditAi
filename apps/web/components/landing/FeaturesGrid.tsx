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
    label: "EXPLAINABILITY",
    title: "SHAP & LIME Explanations",
    body: "Waterfall, beeswarm, and force-plot visualizations reveal exactly why the model scored each applicant — satisfying regulatory transparency requirements.",
  },
  {
    number: "02",
    label: "FAIRNESS",
    title: "Algorithmic Bias Auditing",
    body: "AIF360 and Fairlearn power five fairness metrics — demographic parity, equalized odds, disparate impact — with automated mitigation strategies.",
  },
  {
    number: "03",
    label: "UNCERTAINTY",
    title: "Conformal Prediction Intervals",
    body: "MAPIE-backed conformal prediction delivers 95% coverage guarantees so every score ships with a calibrated confidence range.",
  },
  {
    number: "04",
    label: "ALTERNATIVE DATA",
    title: "Thin-File Inclusion",
    body: "Mobile usage, utility payments, and rental history enrich scoring for applicants traditional credit features would exclude.",
  },
  {
    number: "05",
    label: "DRIFT",
    title: "Production Drift Monitoring",
    body: "PSI, KS-test, and AUC tracking detect model degradation in real time — with automated Celery retrain triggers when thresholds breach.",
  },
  {
    number: "06",
    label: "NLP",
    title: "FinBERT Narrative Analysis",
    body: "Financial text embeddings from FinBERT enrich thin-file profiles, transforming unstructured narratives into predictive credit signals.",
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
          Research Capabilities
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
