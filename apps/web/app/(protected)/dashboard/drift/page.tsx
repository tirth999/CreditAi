"use client"

import { useSession } from "next-auth/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import DriftTimeline from "@/components/charts/DriftTimeline"
import { useDriftLatest, useDriftHistory, useTriggerRetrain } from "@/hooks/useDrift"

const MOCK_PSI = [
  { feature: "payment_history_pct", psi: 0.04 }, { feature: "credit_utilization_pct", psi: 0.15 },
  { feature: "annual_income", psi: 0.08 }, { feature: "credit_length_months", psi: 0.03 },
  { feature: "new_inquiries_6m", psi: 0.22 }, { feature: "amounts_owed", psi: 0.06 },
]
const MOCK_KS = [
  { feature: "payment_history_pct", ks_stat: 0.032, p_value: 0.78, status: "stable" },
  { feature: "credit_utilization_pct", ks_stat: 0.128, p_value: 0.02, status: "drifted" },
  { feature: "annual_income", ks_stat: 0.067, p_value: 0.35, status: "stable" },
  { feature: "new_inquiries_6m", ks_stat: 0.185, p_value: 0.001, status: "drifted" },
]
const MOCK_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  date: `2026-${String(i + 1).padStart(2, "0")}`, payment_history_pct: +(Math.random() * 0.1).toFixed(3),
  credit_utilization_pct: +(0.05 + Math.random() * 0.18).toFixed(3), new_inquiries_6m: +(0.08 + Math.random() * 0.2).toFixed(3),
}))
const MOCK_AUC = Array.from({ length: 12 }, (_, i) => ({
  date: `2026-${String(i + 1).padStart(2, "0")}`, auc: +(0.83 + Math.random() * 0.04).toFixed(3),
}))

function psiColor(v: number) { return v > 0.2 ? "#ef4444" : v > 0.1 ? "#d4a84b" : "#22c55e" }

export default function DriftPage() {
  const { data: session } = useSession()
  const { data: latest } = useDriftLatest()
  const { data: history } = useDriftHistory()
  const retrain = useTriggerRetrain()
  const driftDetected = MOCK_PSI.some(p => p.psi > 0.2)
  const driftCount = MOCK_PSI.filter(p => p.psi > 0.1).length

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Drift Monitor</h1>

      {driftDetected && (
        <Alert variant="destructive" style={{ marginBottom: 24, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16 }}>
          <AlertTriangle size={18} />
          <AlertTitle>Drift detected in {driftCount} features</AlertTitle>
          <AlertDescription>Feature distributions have shifted. Model retraining may be required.</AlertDescription>
        </Alert>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
        {MOCK_PSI.map(p => (
          <div key={p.feature} style={{ background: `${psiColor(p.psi)}10`, border: `1px solid ${psiColor(p.psi)}40`, borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontFamily: "var(--font-palatino)", color: psiColor(p.psi) }}>{p.psi.toFixed(3)}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{p.feature.replace(/_/g, " ")}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>PSI Timeline (90 days)</h2>
        <DriftTimeline history={history ?? MOCK_HISTORY} />
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>KS Test Results</h2>
        <Table>
          <TableHeader><TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
            {["Feature", "KS Stat", "p-value", "Status"].map(h => <TableHead key={h} style={{ color: "var(--text-muted)" }}>{h}</TableHead>)}
          </TableRow></TableHeader>
          <TableBody>
            {MOCK_KS.map((k, i) => (
              <TableRow key={i} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <TableCell style={{ color: `rgb(var(--text))` }}>{k.feature.replace(/_/g, " ")}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{k.ks_stat.toFixed(3)}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{k.p_value.toFixed(4)}</TableCell>
                <TableCell><Badge style={{ background: k.status === "stable" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: k.status === "stable" ? "#22c55e" : "#ef4444", border: `1px solid ${k.status === "stable" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}>{k.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>AUC Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={MOCK_AUC}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis domain={[0.8, 0.9]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8" }} />
            <Line type="monotone" dataKey="auc" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: "#d4a84b", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {(session?.user as any)?.role === "admin" && (
        <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28 }}>
          <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 16 }}>Retrain Controls</h2>
          <Button onClick={() => retrain.mutate()} disabled={retrain.isPending}
            style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10 }}>
            {retrain.isPending ? "Retraining..." : "Trigger Retrain"}
          </Button>
          {retrain.isPending && <Progress value={45} style={{ marginTop: 16, maxWidth: 400 }} />}
        </div>
      )}
    </div>
  )
}
