"use client"

import { Scale, Users, Lock, TrendingDown, Smartphone, Shield } from "lucide-react"

const FEATURES = [
  {
    Icon: Scale,
    title: "Regulatory-Grade XAI",
    desc: "SHAP + LIME with ECOA adverse action notices. Legally defensible explanations for every credit denial.",
  },
  {
    Icon: Users,
    title: "Fairness Auditing",
    desc: "Demographic parity, equalized odds, disparate impact across 5 metrics. AIF360 + Fairlearn fully integrated.",
  },
  {
    Icon: Lock,
    title: "Federated Privacy",
    desc: "Multi-institution training without sharing raw data. Differential privacy with epsilon budget tracking per client.",
  },
  {
    Icon: TrendingDown,
    title: "Drift Detection",
    desc: "PSI, KS test, ADWIN — automatic alerts when feature distributions shift. Auto-retrain triggers built in.",
  },
  {
    Icon: Smartphone,
    title: "Alternative Data",
    desc: "Score thin-file borrowers using mobile, utility, and rental signals. Reaching 1.4B unbanked adults.",
  },
  {
    Icon: Shield,
    title: "Compliance Engine",
    desc: "ECOA, GDPR, EU AI Act guardrails in every scoring decision. Compliance-by-design, not as an afterthought.",
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" style={{ padding: "100px 24px", background: "var(--glass-bg)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, letterSpacing: "-0.02em", textAlign: "center", color: `rgb(var(--text))`, marginBottom: 16 }}>
          Every Open Problem. One Platform.
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 16, maxWidth: 600, margin: "0 auto 64px" }}>
          CreditAI directly implements solutions to the 7 challenges identified across the peer-reviewed literature on AI credit scoring.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title}
              style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: 28, transition: "all 300ms cubic-bezier(0.23,1,0.32,1)", cursor: "default", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 48px rgba(0,0,0,0.2)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon size={22} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 19, color: `rgb(var(--text))`, marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
