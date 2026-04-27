"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from "recharts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Props {
  data: Record<string, Array<{ group: string; approval_rate: number }>>
}

export default function FairnessBarChart({ data }: Props) {
  const groups = Object.keys(data)
  const [active, setActive] = useState(groups[0] || "gender")

  return (
    <div>
      <Tabs value={active} onValueChange={setActive}>
        <TabsList style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, marginBottom: 20 }}>
          {groups.map(g => (
            <TabsTrigger key={g} value={g} style={{ fontSize: 13 }}>
              {g.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.map(g => (
          <TabsContent key={g} value={g}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data[g]} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="group" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} label={{ value: "Approval Rate %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8", fontSize: 12 }} />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="6 4" label={{ value: "80% threshold", position: "right", fill: "#ef4444", fontSize: 11 }} />
                <Bar dataKey="approval_rate" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
