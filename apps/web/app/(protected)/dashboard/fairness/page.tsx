"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import FairnessBarChart from "@/components/charts/FairnessBarChart"
import ScorePDFExport from "@/components/score/ScorePDFExport"
import { useFairnessAggregate } from "@/hooks/useFairness"
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const MOCK_METRICS = [
  { name: "Demographic Parity Diff", value: 0.042, threshold: 0.10, pass: true },
  { name: "Equalized Odds Diff", value: 0.067, threshold: 0.10, pass: true },
  { name: "Disparate Impact Ratio", value: 0.87, threshold: 0.80, pass: true, above: true },
  { name: "Statistical Parity Diff", value: 0.038, threshold: 0.10, pass: true },
]

const MOCK_BAR_DATA = {
  gender: [{ group: "Male", approval_rate: 78 }, { group: "Female", approval_rate: 82 }, { group: "Non-binary", approval_rate: 80 }],
  age_group: [{ group: "18-24", approval_rate: 65 }, { group: "25-34", approval_rate: 79 }, { group: "35-44", approval_rate: 85 }, { group: "45-54", approval_rate: 82 }, { group: "55+", approval_rate: 88 }],
  zip_region: [{ group: "Urban", approval_rate: 80 }, { group: "Suburban", approval_rate: 83 }, { group: "Rural", approval_rate: 76 }],
}

const MOCK_TRADEOFF = [
  { accuracy: 0.85, fairness: 0.92, model: "XGBoost" },
  { accuracy: 0.82, fairness: 0.96, model: "LogReg" },
  { accuracy: 0.78, fairness: 0.98, model: "EBM" },
  { accuracy: 0.83, fairness: 0.90, model: "LightGBM" },
]

export default function FairnessPage() {
  const { data: fairness } = useFairnessAggregate()
  const metrics = MOCK_METRICS
  const barData = (fairness as any)?.bar_data ?? MOCK_BAR_DATA

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Fairness Audit</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {metrics.map(m => (
          <Card key={m.name} style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: `1px solid ${m.pass ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 16 }}>
            <CardHeader style={{ paddingBottom: 4 }}><CardTitle style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.name}</CardTitle></CardHeader>
            <CardContent>
              <div style={{ fontSize: 28, fontFamily: "var(--font-palatino)", color: m.pass ? "#22c55e" : "#ef4444" }}>{m.value.toFixed(3)}</div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Threshold: {m.above ? ">" : "<"} {m.threshold}</p>
              <div style={{ fontSize: 12, fontWeight: 600, color: m.pass ? "#22c55e" : "#ef4444", marginTop: 4 }}>{m.pass ? "✓ Pass" : "✗ Fail"}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>Approval Rates by Group</h2>
        <FairnessBarChart data={barData} />
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>Accuracy vs Fairness Tradeoff</h2>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="accuracy" name="Accuracy" type="number" domain={[0.7, 0.9]} tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Accuracy", position: "bottom", fill: "#94a3b8" }} />
            <YAxis dataKey="fairness" name="Fairness" type="number" domain={[0.85, 1]} tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Fairness", angle: -90, position: "insideLeft", fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8", fontSize: 12 }} />
            <Scatter data={MOCK_TRADEOFF} fill="#d4a84b" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Accordion type="single" collapsible>
          <AccordionItem value="mitigation" style={{ border: "1px solid var(--glass-border)", borderRadius: 16, overflow: "hidden" }}>
            <AccordionTrigger style={{ padding: "16px 20px", color: `rgb(var(--text))`, fontFamily: "var(--font-palatino)" }}>Mitigation Strategies</AccordionTrigger>
            <AccordionContent style={{ padding: "0 20px 16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { title: "Reweighing (AIF360)", desc: "Pre-processing technique that assigns weights to training examples to remove discrimination without modifying labels." },
                  { title: "ThresholdOptimizer (Fairlearn)", desc: "Post-processing technique that finds group-specific classification thresholds to satisfy fairness constraints." },
                  { title: "EqOddsPostprocessing (AIF360)", desc: "Adjusts predictions to satisfy equalized odds by calibrating output probabilities across protected groups." },
                ].map(s => (
                  <div key={s.title}>
                    <div style={{ fontWeight: 600, color: `rgb(var(--text))`, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <ScorePDFExport scoreData={{ score: 742, risk_tier: "Low", probability_of_default: 0.11, fairness_metrics: { demographic_parity: 0.042, equalized_odds: 0.067, disparate_impact: 0.87, statistical_parity: 0.038 } } as any} />
    </div>
  )
}
