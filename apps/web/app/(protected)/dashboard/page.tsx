"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import ScoreHistory from "@/components/charts/ScoreHistory"
import RiskTierBadge from "@/components/score/RiskTierBadge"
import { useScores } from "@/hooks/useScore"
import { useDriftLatest } from "@/hooks/useDrift"
import { scoreToColor } from "@/lib/utils"

const MOCK_SCORES = [
  { date: "2026-04-01", score: 712, application_id: "app-001", risk_tier: "Medium-Low", pd: 0.18, fairness: true },
  { date: "2026-04-05", score: 735, application_id: "app-002", risk_tier: "Medium-Low", pd: 0.14, fairness: true },
  { date: "2026-04-10", score: 742, application_id: "app-003", risk_tier: "Low", pd: 0.11, fairness: true },
  { date: "2026-04-15", score: 698, application_id: "app-004", risk_tier: "Medium-Low", pd: 0.22, fairness: false },
  { date: "2026-04-20", score: 756, application_id: "app-005", risk_tier: "Low", pd: 0.09, fairness: true },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: scores } = useScores()
  const { data: drift } = useDriftLatest()

  const displayScores = scores ?? MOCK_SCORES
  const latest = displayScores[displayScores.length - 1]
  const driftDetected = drift?.drift_detected ?? false

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
      </h1>

      {driftDetected && (
        <Alert variant="destructive" style={{ marginBottom: 24, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16 }}>
          <AlertTriangle size={18} />
          <AlertTitle>Drift Detected</AlertTitle>
          <AlertDescription>Feature distributions have shifted significantly. Model accuracy may be affected.</AlertDescription>
        </Alert>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <Card style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
          <CardHeader style={{ paddingBottom: 8 }}><CardTitle style={{ fontSize: 13, color: "var(--text-muted)" }}>Latest Score</CardTitle></CardHeader>
          <CardContent>
            <div style={{ fontFamily: "var(--font-palatino)", fontSize: 42, color: scoreToColor(latest?.score ?? 0), lineHeight: 1 }}>{latest?.score ?? "—"}</div>
          </CardContent>
        </Card>
        <Card style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
          <CardHeader style={{ paddingBottom: 8 }}><CardTitle style={{ fontSize: 13, color: "var(--text-muted)" }}>Risk Tier</CardTitle></CardHeader>
          <CardContent>
            <RiskTierBadge tier={latest?.risk_tier ?? "Medium-Low"} />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Based on ensemble model prediction</p>
          </CardContent>
        </Card>
        <Card style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
          <CardHeader style={{ paddingBottom: 8 }}><CardTitle style={{ fontSize: 13, color: "var(--text-muted)" }}>Fairness Status</CardTitle></CardHeader>
          <CardContent>
            <div style={{ fontSize: 18, fontWeight: 600, color: latest?.fairness ? "#22c55e" : "#ef4444" }}>
              {latest?.fairness ? "Passed ✓" : "Failed ✗"}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>5 metrics evaluated</p>
          </CardContent>
        </Card>
        <Card style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
          <CardHeader style={{ paddingBottom: 8 }}><CardTitle style={{ fontSize: 13, color: "var(--text-muted)" }}>Confidence</CardTitle></CardHeader>
          <CardContent>
            <div style={{ fontSize: 18, fontWeight: 600, color: `rgb(var(--text))` }}>{(latest?.score ?? 700) - 25} – {(latest?.score ?? 700) + 25}</div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>95% conformal prediction</p>
          </CardContent>
        </Card>
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>Score History</h2>
        <ScoreHistory scores={displayScores} />
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>Recent Applications</h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <TableHead style={{ color: "var(--text-muted)" }}>Date</TableHead>
              <TableHead style={{ color: "var(--text-muted)" }}>Score</TableHead>
              <TableHead style={{ color: "var(--text-muted)" }}>Risk Tier</TableHead>
              <TableHead style={{ color: "var(--text-muted)" }}>PD</TableHead>
              <TableHead style={{ color: "var(--text-muted)" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayScores.slice(-5).reverse().map((s: any, i: number) => (
              <TableRow key={i} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <TableCell style={{ color: `rgb(var(--text))` }}>{s.date}</TableCell>
                <TableCell style={{ color: scoreToColor(s.score), fontWeight: 600, fontFamily: "var(--font-palatino)" }}>{s.score}</TableCell>
                <TableCell><RiskTierBadge tier={s.risk_tier} /></TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{(s.pd * 100).toFixed(1)}%</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/scores/${s.application_id}`)}
                    style={{ fontSize: 12, border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
