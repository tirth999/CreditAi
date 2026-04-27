"use client"

const WAVES = [
  {
    era: "Traditional", period: "Pre-2010",
    borderColor: "rgba(100,116,139,0.4)",
    badge: null,
    models: ["Logistic Regression", "FICO Score"],
    pros: ["Interpretable", "Regulatory-safe"],
    cons: ["Linear only", "No thin-file support"],
  },
  {
    era: "Wave 1", period: "2010–2018",
    borderColor: "rgba(59,130,246,0.4)",
    badge: null,
    models: ["Random Forest", "XGBoost"],
    pros: ["+3–8% AUC gain", "Handles nonlinearity"],
    cons: ["Less interpretable", "Tabular only"],
  },
  {
    era: "Wave 2", period: "2018–2022",
    borderColor: "rgba(139,92,246,0.4)",
    badge: null,
    models: ["Deep NN", "LSTM", "GNN"],
    pros: ["Sequential data", "Alternative data"],
    cons: ["Black-box", "XAI gap"],
  },
  {
    era: "CreditAI", period: "Wave 3+",
    borderColor: "rgba(201,168,76,0.5)",
    badge: "YOU ARE HERE",
    badgeBg: "rgba(201,168,76,0.15)",
    badgeColor: "var(--accent-gold)",
    bg: "rgba(201,168,76,0.03)",
    models: ["Transformers", "Federated", "All of the above"],
    pros: ["Every advantage", "All gaps addressed"],
    cons: ["None"],
  },
]

export default function WaveTimeline() {
  return (
    <section style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, letterSpacing: "-0.02em", textAlign: "center", color: `rgb(var(--text))`, marginBottom: 16 }}>
          The Evolution of Credit Scoring
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 16, marginBottom: 64 }}>
          Four generations of models — and the gaps each one left behind.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {WAVES.map(w => (
            <div key={w.era} style={{
              background: (w as any).bg ?? "var(--glass-bg)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${w.borderColor}`,
              borderRadius: 20,
              padding: 28,
              position: "relative",
            }}>
              {w.badge && (
                <div style={{ display: "inline-block", background: (w as any).badgeBg, color: (w as any).badgeColor, border: `1px solid ${w.borderColor}`, borderRadius: 100, padding: "3px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 16 }}>
                  {w.badge}
                </div>
              )}
              <div style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))`, marginBottom: 4 }}>{w.era}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>{w.period}</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>MODELS</div>
                {w.models.map(m => (
                  <div key={m} style={{ fontSize: 13, color: `rgb(var(--text))`, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-gold)", display: "inline-block", flexShrink: 0 }} />
                    {m}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#22c55e", marginBottom: 6 }}>PROS</div>
                {w.pros.map(p => <div key={p} style={{ fontSize: 12, color: "rgba(34,197,94,0.8)", marginBottom: 3 }}>{"✓ " + p}</div>)}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#ef4444", marginBottom: 6 }}>CONS</div>
                {w.cons.map(c => (
                  <div key={c} style={{ fontSize: 12, color: c === "None" ? "#22c55e" : "rgba(239,68,68,0.8)", marginBottom: 3 }}>
                    {c === "None" ? "✓ None" : "✗ " + c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
