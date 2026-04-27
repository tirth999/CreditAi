"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import ShapBeeswarm from "@/components/charts/ShapBeeswarm"

const FEATURES = ["payment_history_pct", "credit_utilization_pct", "annual_income", "credit_length_months", "new_inquiries_6m"]

const MOCK_BEESWARM = FEATURES.flatMap(f =>
  Array.from({ length: 30 }, (_, i) => ({
    application_id: `app-${i}`, feature_value: Math.random() * 100, shap_value: (Math.random() - 0.5) * 0.4,
  }))
)

const MOCK_IMPORTANCE = FEATURES.map(f => ({
  feature: f.replace(/_/g, " "),
  shap: +(Math.random() * 0.2).toFixed(3),
  gain: +(Math.random() * 0.3).toFixed(3),
}))

export default function XAIExplorerPage() {
  const [feature, setFeature] = useState(FEATURES[0])
  const [useGain, setUseGain] = useState(false)
  const [selectedApp, setSelectedApp] = useState("app-001")

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>XAI Explorer</h1>
      <Tabs defaultValue="beeswarm">
        <TabsList style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, marginBottom: 24 }}>
          <TabsTrigger value="beeswarm">SHAP Beeswarm</TabsTrigger>
          <TabsTrigger value="lime">LIME vs SHAP</TabsTrigger>
          <TabsTrigger value="interp">Interpretable vs Black-Box</TabsTrigger>
          <TabsTrigger value="global">Global Importance</TabsTrigger>
        </TabsList>

        <TabsContent value="beeswarm">
          <Select value={feature} onValueChange={setFeature}>
            <SelectTrigger style={{ width: 260, marginBottom: 16, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURES.map(f => <SelectItem key={f} value={f}>{f.replace(/_/g, " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28 }}>
            <ShapBeeswarm data={MOCK_BEESWARM.slice(0, 30)} feature={feature} />
          </div>
        </TabsContent>

        <TabsContent value="lime">
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger style={{ width: 200, marginBottom: 16, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => <SelectItem key={i} value={`app-${String(i + 1).padStart(3, "0")}`}>App {i + 1}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge style={{ marginBottom: 16, background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)" }}>Agreement: 87%</Badge>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {["LIME Explanation", "SHAP Explanation"].map(title => (
              <Card key={title} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
                <CardHeader><CardTitle style={{ fontSize: 16, color: `rgb(var(--text))` }}>{title}</CardTitle></CardHeader>
                <CardContent>
                  {FEATURES.slice(0, 4).map(f => (
                    <div key={f} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--glass-border)", fontSize: 13 }}>
                      <span style={{ color: "var(--text-muted)" }}>{f.replace(/_/g, " ")}</span>
                      <span style={{ color: Math.random() > 0.5 ? "#14b8a6" : "#ef4444", fontWeight: 600 }}>{(Math.random() * 0.2 - 0.1).toFixed(3)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interp">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[{ title: "Interpretable (LogReg/EBM)", color: "#14b8a6" }, { title: "Black-Box (XGBoost)", color: "#d4a84b" }].map(m => (
              <div key={m.title} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28 }}>
                <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 18, color: `rgb(var(--text))`, marginBottom: 16 }}>{m.title}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={MOCK_IMPORTANCE} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8", fontSize: 12 }} />
                    <Bar dataKey="shap" fill={m.color} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 16, textAlign: "center" }}>
            Interpretability cost: ~2.1% AUC tradeoff for full regulatory transparency.
          </p>
        </TabsContent>

        <TabsContent value="global">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Switch checked={useGain} onCheckedChange={setUseGain} />
            <Label style={{ color: `rgb(var(--text))`, fontSize: 14 }}>{useGain ? "Gain" : "Mean |SHAP|"}</Label>
          </div>
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_IMPORTANCE} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis dataKey="feature" type="category" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8", fontSize: 12 }} />
                <Bar dataKey={useGain ? "gain" : "shap"} fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
