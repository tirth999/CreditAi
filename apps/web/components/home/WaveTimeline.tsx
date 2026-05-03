"use client"

import { motion } from "framer-motion"

const WAVES = [
  {
    era: "Traditional",
    period: "Pre-2010",
    models: ["Logistic Regression", "FICO Score"],
    pros: ["Interpretable", "Regulatory-safe"],
    cons: ["Linear only", "No thin-file support"],
    accent: "var(--neutral)",
    current: false,
  },
  {
    era: "Wave 1",
    period: "2010–2018",
    models: ["Random Forest", "XGBoost"],
    pros: ["+3–8% AUC gain", "Handles nonlinearity"],
    cons: ["Less interpretable", "Tabular only"],
    accent: "var(--data-blue)",
    current: false,
  },
  {
    era: "Wave 2",
    period: "2018–2022",
    models: ["Deep NN", "LSTM", "GNN"],
    pros: ["Sequential data", "Alternative data"],
    cons: ["Black-box", "XAI gap"],
    accent: "var(--data-blue)",
    current: false,
  },
  {
    era: "CreditAI",
    period: "Wave 3+",
    badge: "YOU ARE HERE",
    models: ["Transformers", "Federated", "Full Ensemble"],
    pros: ["Every advantage", "All gaps addressed"],
    cons: ["None"],
    accent: "var(--accent)",
    current: true,
  },
]

export default function WaveTimeline() {
  return (
    <section style={{ padding: "120px 48px", background: "var(--bg-primary)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--brand)", marginBottom: 12 }}>
            The Evolution of Credit Scoring
          </h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "var(--neutral)", lineHeight: 1.7, maxWidth: 520 }}>
            Four generations of models — and the gaps each one left behind.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, border: "1px solid var(--border)" }}>
          {WAVES.map((w, i) => (
            <motion.div
              key={w.era}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: w.current ? "var(--bg-raised)" : "var(--bg-surface)",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                padding: "32px 28px",
                position: "relative",
              }}
            >
              {w.badge && (
                <div style={{
                  display: "inline-block",
                  background: "transparent",
                  color: "var(--accent)",
                  border: "1px solid var(--accent)",
                  borderRadius: 4,
                  padding: "2px 10px",
                  fontSize: 10,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                }}>
                  {w.badge}
                </div>
              )}

              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: "var(--brand)", marginBottom: 2 }}>{w.era}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--neutral)", marginBottom: 24 }}>{w.period}</div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", color: "var(--neutral)", marginBottom: 10 }}>MODELS</div>
                {w.models.map(m => (
                  <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--brand)", marginBottom: 5 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: w.accent, flexShrink: 0 }} />
                    {m}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", color: "var(--safe-green)", marginBottom: 8 }}>PROS</div>
                {w.pros.map(p => (
                  <div key={p} style={{ fontSize: 12, fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--safe-green)", marginBottom: 3 }}>✓ {p}</div>
                ))}
              </div>

              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", color: "var(--risk-red)", marginBottom: 8 }}>CONS</div>
                {w.cons.map(c => (
                  <div key={c} style={{ fontSize: 12, fontFamily: "'IBM Plex Sans', sans-serif", color: c === "None" ? "var(--safe-green)" : "var(--risk-red)", marginBottom: 3 }}>
                    {c === "None" ? "✓ None" : `✗ ${c}`}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
