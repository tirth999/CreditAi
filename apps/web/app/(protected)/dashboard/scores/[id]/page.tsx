"use client"

import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ScoreGauge from "@/components/charts/ScoreGauge"
import ShapWaterfall from "@/components/charts/ShapWaterfall"
import RiskTierBadge from "@/components/score/RiskTierBadge"
import ConfidenceInterval from "@/components/score/ConfidenceInterval"
import AdverseActionNotice from "@/components/score/AdverseActionNotice"
import ScorePDFExport from "@/components/score/ScorePDFExport"
import { useScore } from "@/hooks/useScore"
import { scoreToColor } from "@/lib/utils"

const MOCK = {
  score: 742, risk_tier: "Low", probability_of_default: 0.11,
  confidence_lower: 718, confidence_upper: 766, model_version: "xgb-v2.1",
  alt_data_used: true, nlp_used: false,
  shap_values: [
    { feature_name: "payment_history_pct", shap_value: 0.18, feature_value: 97, direction: "positive" },
    { feature_name: "annual_income", shap_value: 0.14, feature_value: 82000, direction: "positive" },
    { feature_name: "credit_length_months", shap_value: 0.08, feature_value: 96, direction: "positive" },
    { feature_name: "credit_utilization_pct", shap_value: -0.12, feature_value: 42, direction: "negative" },
    { feature_name: "new_inquiries_6m", shap_value: -0.06, feature_value: 3, direction: "negative" },
  ],
  adverse_action_reasons: [
    { code: "AR001", plain_text: "Credit utilization ratio above optimal threshold", shap_value: -0.12 },
    { code: "AR002", plain_text: "Recent credit inquiries may indicate credit-seeking behavior", shap_value: -0.06 },
    { code: "AR003", plain_text: "Limited credit mix diversity", shap_value: -0.03 },
  ],
  fairness_metrics: { demographic_parity: 0.04, equalized_odds: 0.06, disparate_impact: 0.87 },
}

export default function ScoreDetailPage() {
  const { id } = useParams()
  const { data: scoreData } = useScore(id as string)
  const d = scoreData ?? MOCK
  const showAdverse = d.score < 620 || d.probability_of_default > 0.5

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Score Detail</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, marginBottom: 32 }}>
        {/* Left column */}
        <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <ScoreGauge score={d.score} size={240} />
          <div style={{ fontFamily: "var(--font-palatino)", fontSize: 64, color: scoreToColor(d.score), lineHeight: 1, marginTop: 8 }}>{d.score}</div>
          <div style={{ marginTop: 8 }}><RiskTierBadge tier={d.risk_tier} /></div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 12 }}>Probability of default: <strong style={{ color: `rgb(var(--text))` }}>{(d.probability_of_default * 100).toFixed(1)}%</strong></p>
          <div style={{ marginTop: 16, width: "100%" }}><ConfidenceInterval lower={d.confidence_lower ?? d.score - 25} upper={d.confidence_upper ?? d.score + 25} score={d.score} /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <Badge variant="outline" style={{ fontSize: 11, border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>{d.model_version ?? "xgb-v2.1"}</Badge>
            {d.alt_data_used && <Badge style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)", fontSize: 11 }}>Alt Data Used</Badge>}
            {d.nlp_used && <Badge style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)", fontSize: 11 }}>NLP Used</Badge>}
          </div>
        </div>

        {/* Right column */}
        <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))`, marginBottom: 20 }}>What Affected Your Score</h2>
          <ShapWaterfall shapValues={d.shap_values} />
          <Card style={{ marginTop: 20, background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: 12 }}>
            <CardContent style={{ padding: 16 }}>
              <p style={{ fontSize: 13, color: `rgb(var(--text))`, marginBottom: 6 }}>
                <span style={{ color: "#14b8a6" }}>↑</span> Your strongest factor is <strong>{d.shap_values[0]?.feature_name.replace(/_/g, " ")}</strong>, contributing positively to your score.
              </p>
              <p style={{ fontSize: 13, color: `rgb(var(--text))` }}>
                <span style={{ color: "#ef4444" }}>↓</span> The biggest drag is <strong>{d.shap_values.find((s: { shap_value: number }) => s.shap_value < 0)?.feature_name.replace(/_/g, " ") ?? "N/A"}</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAdverse && (
        <div style={{ marginBottom: 32 }}>
          <AdverseActionNotice reasons={d.adverse_action_reasons ?? []} />
        </div>
      )}

      {/* Feature Percentile Bars */}
      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>How You Compare</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>Your feature values compared to approved applicants (percentile rank).</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { name: "Payment History", value: 97, percentile: 85 },
            { name: "Credit Utilization", value: 42, percentile: 45 },
            { name: "Annual Income", value: 82000, percentile: 72 },
            { name: "Credit Length", value: 96, percentile: 78 },
            { name: "New Inquiries", value: 3, percentile: 35 },
            { name: "Amounts Owed", value: 5000, percentile: 55 },
          ].map((feat) => (
            <div key={feat.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: `rgb(var(--text))` }}>{feat.name}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{feat.percentile}th percentile</span>
              </div>
              <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${feat.percentile}%`,
                    borderRadius: 4,
                    background: feat.percentile >= 60
                      ? "linear-gradient(90deg, rgba(20,184,166,0.6), rgba(20,184,166,0.9))"
                      : feat.percentile >= 40
                        ? "linear-gradient(90deg, rgba(212,168,75,0.6), rgba(212,168,75,0.9))"
                        : "linear-gradient(90deg, rgba(239,68,68,0.6), rgba(239,68,68,0.9))",
                    transition: "width 0.8s ease-out",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <ScorePDFExport scoreData={d as any} />
      </div>
    </div>
  )
}
