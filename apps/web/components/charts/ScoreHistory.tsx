"use client"

import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface Props {
  scores: Array<{ date: string; score: number; application_id: string }>
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props
  return (
    <circle cx={cx} cy={cy} r={5} fill="#d4a84b" stroke="#0a0f1e" strokeWidth={2}
      style={{ cursor: "pointer" }} />
  )
}

export default function ScoreHistory({ scores }: Props) {
  const router = useRouter()

  const handleClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.application_id) {
      router.push(`/dashboard/scores/${data.activePayload[0].payload.application_id}`)
    }
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={scores} margin={{ top: 10, right: 20, bottom: 20, left: 20 }} onClick={handleClick}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
        <YAxis domain={[300, 850]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
        <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8", fontSize: 12 }} />
        <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 7, fill: "#d4a84b" }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
