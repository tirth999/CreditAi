"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from "recharts"

interface Props {
  history: Array<{ date: string; [feature: string]: number | string }>
}

const COLORS = ["#14b8a6", "#d4a84b", "#ef4444", "#60a5fa", "#a78bfa", "#f472b6", "#34d399"]

export default function DriftTimeline({ history }: Props) {
  if (!history?.length) return null
  const features = Object.keys(history[0]).filter(k => k !== "date")

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={history} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
        <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8", fontSize: 12 }} />
        <ReferenceLine y={0.1} stroke="#d4a84b" strokeDasharray="6 4" label={{ value: "Warning", position: "right", fill: "#d4a84b", fontSize: 10 }} />
        <ReferenceLine y={0.2} stroke="#ef4444" strokeDasharray="6 4" label={{ value: "Critical", position: "right", fill: "#ef4444", fontSize: 10 }} />
        {features.map((f, i) => (
          <Area key={f} type="monotone" dataKey={f} stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]} fillOpacity={0.08} strokeWidth={2} dot={false} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
