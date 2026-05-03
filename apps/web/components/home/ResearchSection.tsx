"use client"

import { motion } from "framer-motion"

const PAPERS = [
  { year: "2020", author: "Bhatore et al.", title: "Machine learning techniques for credit risk evaluation", model: "LR/DT/RF/ANN", metric: "F1: 0.81", gap: "No fairness analysis", solution: "5-metric fairness audit (parity, odds, impact)" },
  { year: "2022", author: "Dumitrescu et al.", title: "Machine learning for credit scoring: Improving logistic regression", model: "XGBoost/MLP", metric: "AUC: 0.82", gap: "Single institution data", solution: "Multi-dataset + federated learning" },
  { year: "2021", author: "Moscato et al.", title: "A benchmark of ML techniques for credit risk", model: "LightGBM + SHAP", metric: "AUC: 0.88", gap: "No regulatory validation", solution: "ECOA adverse action notices" },
  { year: "2023", author: "Luo et al.", title: "GNN-based credit scoring with social relations", model: "GNN + LSTM", metric: "F1: 0.79", gap: "Requires social graph", solution: "GNN on synthetic financial network" },
  { year: "2022", author: "Zhang & Thomas", title: "FinBERT for financial risk assessment", model: "FinBERT", metric: "Gini: 0.71", gap: "Very opaque model", solution: "FinBERT + SHAP fusion for NLP" },
  { year: "2023", author: "Shen et al.", title: "Federated learning for credit risk management", model: "Federated GBT", metric: "AUC: 0.80", gap: "Simulated data only", solution: "Real Flower federation + DP budget" },
  { year: "2020", author: "Dastile et al.", title: "Statistical and ML models in credit scoring", model: "SVM/RF/DNN", metric: "Acc: 0.85", gap: "Old benchmark datasets", solution: "6 real + synthetic datasets" },
]

export default function ResearchSection() {
  return (
    <section id="research" style={{ padding: "120px 48px", background: "var(--bg-raised)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--brand)", marginBottom: 12 }}>
            Standing on Peer-Reviewed Research
          </h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "var(--neutral)", lineHeight: 1.7, maxWidth: 520 }}>
            CreditAI directly addresses the gaps identified in 7 landmark papers on AI credit scoring.
          </p>
        </motion.div>

        {/* Table layout */}
        <div style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 1fr 1fr",
            borderBottom: "1px solid var(--border)",
            padding: "12px 24px",
            background: "var(--bg-raised)",
          }}>
            {["Year", "Paper", "Gap Identified", "CreditAI Solution"].map(h => (
              <div key={h} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: "var(--neutral)", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {PAPERS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr 1fr",
                padding: "20px 24px",
                borderBottom: i < PAPERS.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-raised)",
                transition: "background 0.2s ease",
                cursor: "default",
              }}
              whileHover={{ backgroundColor: "var(--bg-raised)" } as any}
            >
              {/* Year */}
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: "var(--accent)" }}>{p.year}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--neutral)", marginTop: 3 }}>{p.model}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--data-blue)", marginTop: 1 }}>{p.metric}</div>
              </div>

              {/* Paper */}
              <div style={{ paddingRight: 24 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--brand)", marginBottom: 2, lineHeight: 1.4 }}>{p.author}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--neutral)", lineHeight: 1.5 }}>{p.title}</div>
              </div>

              {/* Gap */}
              <div style={{ paddingRight: 24 }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--risk-red)", display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>✗</span>
                  <span>{p.gap}</span>
                </div>
              </div>

              {/* Solution */}
              <div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--safe-green)", display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span>{p.solution}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
