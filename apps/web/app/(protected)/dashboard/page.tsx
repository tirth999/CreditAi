"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AlertTriangle, TrendingUp, TrendingDown, Users, CheckCircle2, Clock } from "lucide-react"
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

function KPICard({ label, value, sub, trend, trendUp, accent }: {
  label: string; value: string; sub?: string; trend?: string; trendUp?: boolean; accent?: string
}) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "24px 24px 20px",
      transition: "border-color 0.3s ease",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral)", marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 500, color: accent ?? "var(--brand)", lineHeight: 1, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {sub && <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--neutral)" }}>{sub}</div>}
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: trendUp ? "var(--safe-green)" : "var(--risk-red)", background: trendUp ? "rgba(42,102,72,0.08)" : "rgba(166,50,40,0.08)", padding: "2px 8px", borderRadius: 4 }}>
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: scores } = useScores()
  const { data: drift } = useDriftLatest()

  const rawScores = (scores ?? MOCK_SCORES) as any[]
  const displayScores = rawScores.map((s: any) => ({
    date: s.date ?? s.created_at?.slice(0, 10) ?? "",
    score: s.score ?? 0,
    application_id: s.application_id ?? s.id ?? "",
    risk_tier: s.risk_tier ?? "Medium-Low",
    pd: s.pd ?? s.probability_of_default ?? 0,
    fairness: s.fairness ?? true,
  }))
  const latest = displayScores[displayScores.length - 1]
  const driftDetected = drift?.drift_detected ?? false
  const approvalRate = Math.round((displayScores.filter(s => s.score >= 680).length / Math.max(displayScores.length, 1)) * 100)

  return (
    <div style={{ padding: "0" }}>
      {/* Page header */}
      <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--brand)", marginBottom: 4 }}>
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "var(--neutral)" }}>
          Here's your credit portfolio overview for today
        </p>
      </div>

      {/* Drift alert */}
      {driftDetected && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(166,50,40,0.06)", border: "1px solid rgba(166,50,40,0.2)", borderRadius: 8, padding: "14px 18px", marginBottom: 24 }}>
          <AlertTriangle size={16} color="var(--risk-red)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--risk-red)", marginBottom: 2 }}>Drift Detected</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "var(--neutral)" }}>Feature distributions have shifted. Model accuracy may be affected.</div>
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <KPICard label="Applications Today" value="1,247" sub="vs yesterday" trend="+12%" trendUp={true} />
        <KPICard label="Approval Rate" value={`${approvalRate}%`} sub="Based on score ≥ 680" trend="+2.1pp" trendUp={true} accent="var(--safe-green)" />
        <KPICard label="Avg Credit Score" value={latest?.score?.toString() ?? "—"} sub="Ensemble model" accent="var(--data-blue)" />
        <KPICard label="Flagged for Review" value="34" sub="Needs manual review" trend="−5" trendUp={false} accent="var(--risk-red)" />
      </div>

      {/* Score history chart */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: "var(--brand)", marginBottom: 2 }}>Score History</h2>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--neutral)" }}>Last 30 days · {displayScores.length} records</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/scores")}
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--accent)", background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 14px", cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            View All →
          </button>
        </div>
        <ScoreHistory scores={displayScores} />
      </div>

      {/* Recent Applications Table */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: "var(--brand)", marginBottom: 2 }}>Recent Applications</h2>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--neutral)" }}>Latest scoring decisions</p>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 140px 80px 100px 80px", padding: "10px 28px", background: "var(--bg-raised)", borderBottom: "1px solid var(--border)" }}>
          {["Date", "Score", "Risk Tier", "PD", "Decision", ""].map(h => (
            <div key={h} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral)" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {displayScores.slice(-8).reverse().map((s: any, i: number) => {
          const approved = s.score >= 680
          const decision = approved ? "APPROVED" : s.score >= 620 ? "PENDING" : "DENIED"
          const decisionColor = approved ? "var(--safe-green)" : s.score >= 620 ? "var(--accent)" : "var(--risk-red)"
          const decisionBg = approved ? "rgba(42,102,72,0.08)" : s.score >= 620 ? "rgba(200,169,110,0.10)" : "rgba(166,50,40,0.08)"
          return (
            <div
              key={i}
              style={{
                display: "grid", gridTemplateColumns: "1fr 100px 140px 80px 100px 80px",
                padding: "14px 28px",
                borderBottom: i < displayScores.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-raised)",
                transition: "background 0.2s ease, border-left 0.15s ease",
                cursor: "pointer",
                borderLeft: "3px solid transparent",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderLeftColor = "var(--accent)" }}
              onMouseLeave={e => { e.currentTarget.style.borderLeftColor = "transparent" }}
              onClick={() => router.push(`/dashboard/scores/${s.application_id}`)}
            >
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--neutral)", display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={12} color="var(--neutral)" />
                {s.date}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 500, color: scoreToColor(s.score), display: "flex", alignItems: "center" }}>{s.score}</div>
              <div style={{ display: "flex", alignItems: "center" }}><RiskTierBadge tier={s.risk_tier} /></div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--neutral)", display: "flex", alignItems: "center" }}>{(s.pd * 100).toFixed(1)}%</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: decisionColor, background: decisionBg, padding: "3px 8px", borderRadius: 4 }}>
                  {decision}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--neutral)", background: "none", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>View</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
