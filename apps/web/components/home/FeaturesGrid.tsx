"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { Scale, Users, Lock, TrendingDown, Smartphone, Shield } from "lucide-react"
import dynamic from "next/dynamic"

const NeuralNetwork = dynamic(() => import("@/components/three/NeuralNetwork"), { ssr: false })
const RiskGaugeRing = dynamic(() => import("@/components/three/RiskGaugeRing"), { ssr: false })

const FEATURES = [
  {
    Icon: Scale,
    title: "ML Risk Score",
    desc: "Ensemble XGBoost + EBM scoring with 95% conformal prediction intervals. Regulatory-grade accuracy.",
    viz: "gauge",
  },
  {
    Icon: Users,
    title: "Income Verification",
    desc: "Real-time income signal validation from payroll, bank feeds, and alternative data sources.",
    viz: "bar",
  },
  {
    Icon: Shield,
    title: "Fraud Detection",
    desc: "Multi-layer identity and behavioral fraud detection with < 0.3% false positive rate.",
    viz: "alert",
  },
  {
    Icon: Lock,
    title: "Neural Network Analysis",
    desc: "Graph neural networks processing 200+ signals with federated privacy preservation.",
    viz: "neural",
  },
  {
    Icon: TrendingDown,
    title: "Real-time Decisions",
    desc: "Sub-120ms scoring pipeline from application submission to decision output.",
    viz: "speed",
  },
  {
    Icon: Smartphone,
    title: "Explainable AI (XAI)",
    desc: "SHAP + LIME explanations for every decision. ECOA adverse action notices auto-generated.",
    viz: "xai",
  },
]

function FeatureViz({ type }: { type: string }) {
  if (type === "gauge") return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <RiskGaugeRing value={32} size={90} label="Low Risk" />
    </div>
  )
  if (type === "bar") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "4px 0" }}>
      {[{ label: "Payroll", pct: 85 }, { label: "Bank Feed", pct: 62 }, { label: "Alt Data", pct: 40 }].map(b => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--neutral)", marginBottom: 3 }}>
            <span>{b.label}</span><span>{b.pct}%</span>
          </div>
          <div style={{ height: 4, background: "var(--border)", borderRadius: 0, overflow: "hidden" }}>
            <div className="bar-animated" style={{ height: "100%", width: `${b.pct}%`, background: "var(--data-blue)" }} />
          </div>
        </div>
      ))}
    </div>
  )
  if (type === "alert") return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(166,50,40,0.1)", display: "grid", placeItems: "center", border: "1px solid rgba(166,50,40,0.2)" }}>
        <Shield size={16} color="var(--risk-red)" />
      </div>
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 500, color: "var(--risk-red)" }}>0.3%</div>
        <div style={{ fontSize: 11, color: "var(--neutral)", fontFamily: "'DM Sans', sans-serif" }}>False positive rate</div>
      </div>
    </div>
  )
  if (type === "neural") return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <NeuralNetwork width={200} height={100} />
    </div>
  )
  if (type === "speed") return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 36, fontWeight: 500, color: "var(--brand)", letterSpacing: "-0.02em" }}>&lt; 120ms</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--neutral)", marginTop: 4 }}>Average decision time</div>
    </div>
  )
  if (type === "xai") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "4px 0" }}>
      {[{ label: "Payment Hist.", pct: 34 }, { label: "Credit Util.", pct: 22 }, { label: "Income", pct: 17 }].map(b => (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 72, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--neutral)", textAlign: "right", flexShrink: 0 }}>{b.label}</div>
          <div style={{ flex: 1, height: 6, background: "var(--border)", position: "relative" }}>
            <div className="bar-animated" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${b.pct * 2}%`, background: "var(--data-blue)" }} />
          </div>
          <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--neutral)", width: 32 }}>{b.pct}%</div>
        </div>
      ))}
    </div>
  )
  return null
}

export default function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section ref={ref} id="features" style={{ padding: "120px 48px", background: "var(--bg-primary)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--brand)", marginBottom: 12 }}>
            The Full Credit Picture, Instantly.
          </h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "var(--neutral)", maxWidth: 560, marginBottom: 72, lineHeight: 1.7 }}>
            CreditAI directly implements solutions to the 7 open research challenges in AI credit scoring — from XAI to fairness to drift.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, border: "1px solid var(--border)" }}>
          {FEATURES.map(({ Icon, title, desc, viz }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--bg-surface)",
                borderRight: i % 3 !== 2 ? "1px solid var(--border)" : "none",
                borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                padding: "32px 28px",
                transition: "border-color 0.3s ease",
                cursor: "default",
              }}
              whileHover={{ backgroundColor: "var(--bg-raised)" } as any}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Icon size={18} color="var(--accent)" strokeWidth={1.5} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: "var(--brand)", letterSpacing: "-0.01em" }}>{title}</h3>
              </div>
              <FeatureViz type={viz} />
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "var(--neutral)", lineHeight: 1.65, marginTop: 12 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
