"use client"

import { useState } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Model {
  version: string
  auc: number
  f1: number
  gini: number
  fairness: number
  accuracy: number
}

interface Props {
  models: Model[]
}

const METRICS = ["auc", "f1", "gini", "fairness", "accuracy"] as const

export default function ModelComparison({ models }: Props) {
  const [m1, setM1] = useState(models[0]?.version ?? "")
  const [m2, setM2] = useState(models[1]?.version ?? "")

  const model1 = models.find(m => m.version === m1)
  const model2 = models.find(m => m.version === m2)

  const chartData = METRICS.map(metric => ({
    metric: metric.toUpperCase(),
    model1: model1?.[metric] ?? 0,
    model2: model2?.[metric] ?? 0,
  }))

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <Select value={m1} onValueChange={setM1}>
          <SelectTrigger style={{ width: 180, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>
            <SelectValue placeholder="Model A" />
          </SelectTrigger>
          <SelectContent>
            {models.map(m => <SelectItem key={m.version} value={m.version}>{m.version}</SelectItem>)}
          </SelectContent>
        </Select>
        <span style={{ color: "var(--text-muted)", alignSelf: "center" }}>vs</span>
        <Select value={m2} onValueChange={setM2}>
          <SelectTrigger style={{ width: 180, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>
            <SelectValue placeholder="Model B" />
          </SelectTrigger>
          <SelectContent>
            {models.map(m => <SelectItem key={m.version} value={m.version}>{m.version}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[0, 1]} />
          <Radar name={m1} dataKey="model1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} strokeWidth={2} />
          <Radar name={m2} dataKey="model2" stroke="#d4a84b" fill="#d4a84b" fillOpacity={0.15} strokeWidth={2} />
          <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
