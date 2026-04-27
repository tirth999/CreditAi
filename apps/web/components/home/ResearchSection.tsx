"use client"

const PAPERS = [
  {
    year: "2020", author: "Bhatore et al.",
    title: "Machine learning techniques for credit risk evaluation",
    model: "LR/DT/RF/ANN", metric: "F1: 0.81",
    gap: "No fairness analysis",
    solution: "5-metric fairness audit (parity, odds, impact)",
  },
  {
    year: "2022", author: "Dumitrescu et al.",
    title: "Machine learning for credit scoring: Improving logistic regression",
    model: "XGBoost/MLP", metric: "AUC: 0.82",
    gap: "Single institution data",
    solution: "Multi-dataset + federated learning",
  },
  {
    year: "2021", author: "Moscato et al.",
    title: "A benchmark of ML techniques for credit risk",
    model: "LightGBM + SHAP", metric: "AUC: 0.88",
    gap: "No regulatory validation",
    solution: "ECOA adverse action notices",
  },
  {
    year: "2023", author: "Luo et al.",
    title: "GNN-based credit scoring with social relations",
    model: "GNN + LSTM", metric: "F1: 0.79",
    gap: "Requires social graph",
    solution: "GNN on synthetic financial network",
  },
  {
    year: "2022", author: "Zhang & Thomas",
    title: "FinBERT for financial risk assessment",
    model: "FinBERT", metric: "Gini: 0.71",
    gap: "Very opaque model",
    solution: "FinBERT + SHAP fusion for NLP",
  },
  {
    year: "2023", author: "Shen et al.",
    title: "Federated learning for credit risk management",
    model: "Federated GBT", metric: "AUC: 0.80",
    gap: "Simulated data only",
    solution: "Real Flower federation + DP budget",
  },
  {
    year: "2020", author: "Dastile et al.",
    title: "Statistical and ML models in credit scoring",
    model: "SVM/RF/DNN", metric: "Acc: 0.85",
    gap: "Old benchmark datasets",
    solution: "6 real + synthetic datasets",
  },
]

export default function ResearchSection() {
  return (
    <section id="research" style={{ padding: "100px 24px", background: "var(--glass-bg)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, letterSpacing: "-0.02em", textAlign: "center", color: `rgb(var(--text))`, marginBottom: 16 }}>
          Standing on Peer-Reviewed Research
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 16, maxWidth: 560, margin: "0 auto 56px" }}>
          CreditAI directly addresses the gaps identified in these 7 landmark papers:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {PAPERS.map((p, i) => (
            <div key={i}
              style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 24, transition: "border-color 300ms, transform 300ms" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)"; (e.currentTarget as HTMLElement).style.transform = "" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-palatino)", fontSize: 18, color: "var(--accent-gold)" }}>{p.year}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)", borderRadius: 6, padding: "2px 8px" }}>{p.model}</span>
                  <span style={{ fontSize: 11, background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 6, padding: "2px 8px" }}>{p.metric}</span>
                </div>
              </div>
              <div style={{ fontSize: 14, color: `rgb(var(--text))`, fontWeight: 500, marginBottom: 4 }}>{p.author}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>{p.title}</div>
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 6 }}>{"✗ Gap: " + p.gap}</div>
                <div style={{ fontSize: 11 }}>
                  <span style={{ color: "var(--accent-gold)" }}>CreditAI: </span>
                  <span style={{ color: "var(--text-muted)" }}>{p.solution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
