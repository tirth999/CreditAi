"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import dynamic from "next/dynamic"

const NeuralNetwork = dynamic(() => import("@/components/three/NeuralNetwork"), { ssr: false })
const RiskGaugeRing = dynamic(() => import("@/components/three/RiskGaugeRing"), { ssr: false })

const STEPS = [
  {
    num: "01",
    title: "Submit Application",
    body: "Applicant submits a structured form with financial, identity, and optional alternative data signals.",
    icon: "📋",
    viz: null,
  },
  {
    num: "02",
    title: "AI Analyzes 200+ Signals",
    body: "Our neural ensemble processes payment history, income, utilization, behavioral signals, and NLP narratives simultaneously.",
    icon: "🧠",
    viz: "neural",
  },
  {
    num: "03",
    title: "Instant Decision + Explanation",
    body: "A risk score, SHAP explanation, fairness audit, and adverse action notice — all in under 120ms.",
    icon: "⚡",
    viz: "gauge",
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"])

  return (
    <section ref={ref} id="how-it-works" style={{ padding: "120px 48px", background: "var(--bg-raised)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 80 }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--brand)", marginBottom: 12 }}>
            How It Works
          </h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "var(--neutral)", lineHeight: 1.7, maxWidth: 480 }}>
            Three steps from application to decision — no black boxes.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, position: "relative" }}>
          {/* Animated connector line */}
          <div style={{ position: "absolute", top: 42, left: "16.6%", right: "16.6%", height: 1, background: "var(--border)", zIndex: 0 }}>
            <motion.div style={{ height: "100%", background: "var(--accent)", width: lineWidth }} />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: "0 32px", position: "relative", zIndex: 1 }}
            >
              {/* Step number circle */}
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28, position: "relative",
              }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: "var(--accent)" }}>
                  {step.num}
                </span>
              </div>

              {/* Big ghost number */}
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 120, fontWeight: 300,
                color: "var(--brand)", opacity: 0.06,
                lineHeight: 1, position: "absolute", top: -16, left: 28,
                pointerEvents: "none", userSelect: "none",
              }}>
                {step.num}
              </div>

              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500, color: "var(--brand)", marginBottom: 12, letterSpacing: "-0.01em" }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "var(--neutral)", lineHeight: 1.7, marginBottom: 24 }}>
                {step.body}
              </p>

              {step.viz === "neural" && (
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--bg-surface)" }}>
                  <NeuralNetwork width={300} height={160} />
                </div>
              )}
              {step.viz === "gauge" && (
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, background: "var(--bg-surface)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <RiskGaugeRing value={32} size={120} label="Low Risk" />
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--neutral)" }}>742 · EXCELLENT</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
