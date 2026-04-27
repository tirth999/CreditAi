"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ScoreGauge from "@/components/charts/ScoreGauge"
import RiskTierBadge from "@/components/score/RiskTierBadge"
import ShapWaterfall from "@/components/charts/ShapWaterfall"

const FALLBACK_DEMO = {
  score: 712,
  risk_tier: "Medium-Low",
  probability_of_default: 0.18,
  shap_values: [
    { feature_name: "payment_history_pct",    shap_value: 0.15,  feature_value: 95,    direction: "positive" },
    { feature_name: "credit_utilization_ratio", shap_value: -0.08, feature_value: 45,   direction: "negative" },
    { feature_name: "annual_income",           shap_value: 0.12,  feature_value: 75000, direction: "positive" },
    { feature_name: "new_inquiries_6m",        shap_value: -0.05, feature_value: 2,     direction: "negative" },
    { feature_name: "credit_length_months",    shap_value: 0.06,  feature_value: 84,    direction: "positive" },
  ],
  fairness: { passed: true },
}

function scoreColor(s: number) {
  if (s >= 740) return "#22c55e"
  if (s >= 670) return "#14b8a6"
  if (s >= 580) return "#d4a84b"
  return "#ef4444"
}

export default function DemoPage() {
  const [demo, setDemo] = useState<typeof FALLBACK_DEMO | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDemo = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8001/ml/demo/generate", {
        headers: { "X-API-Key": "d2100ed758b39fa240c611035fbe3be6" },
      })
      if (!res.ok) throw new Error("ML service unavailable")
      setDemo(await res.json())
    } catch {
      setDemo(FALLBACK_DEMO)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDemo() }, [])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "var(--bg-primary)" }}>
        <div style={{ width: 48, height: 48, border: "3px solid var(--glass-border)", borderTopColor: "var(--accent-gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Generating synthetic application…</p>
      </div>
    )
  }

  if (!demo) return null

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "100px 24px 64px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <Badge style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 100, padding: "4px 14px", fontSize: 12 }}>
            Demo Mode — No real data
          </Badge>
          <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, color: `rgb(var(--text))`, marginTop: 20, marginBottom: 8 }}>
            Live Credit Score Demo
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Synthetic applicant data — see exactly how CreditAI scores and explains a credit decision.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 24 }}>
          {/* Score card */}
          <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <ScoreGauge score={demo.score} size={200} />
            <div style={{ fontFamily: "var(--font-palatino)", fontSize: 56, color: scoreColor(demo.score), marginTop: 8, lineHeight: 1 }}>{demo.score}</div>
            <RiskTierBadge tier={demo.risk_tier} />
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 12 }}>
              Probability of default: <strong style={{ color: `rgb(var(--text))` }}>{(demo.probability_of_default * 100).toFixed(1)}%</strong>
            </p>
          </div>

          {/* SHAP */}
          <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))`, marginBottom: 20 }}>What Affected Your Score</h2>
            <ShapWaterfall shapValues={demo.shap_values} />
          </div>
        </div>

        {/* Fairness */}
        <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 12 }}>Fairness Check</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{demo.fairness?.passed ? "✓" : "✗"}</span>
            <span style={{ fontSize: 15, color: demo.fairness?.passed ? "#22c55e" : "#ef4444" }}>
              {demo.fairness?.passed ? "Passed all 5 fairness metrics — demographically neutral decision." : "Failed fairness thresholds — requires human review."}
            </span>
          </div>
        </div>

        <Button onClick={fetchDemo}
          style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", borderRadius: 10, fontWeight: 600, padding: "12px 28px", fontSize: 15 }}>
          Try Another Application →
        </Button>
      </div>
    </div>
  )
}
