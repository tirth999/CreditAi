"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import RiskTierBadge from "@/components/score/RiskTierBadge"
import { useScores } from "@/hooks/useScore"
import { scoreToColor } from "@/lib/utils"

const MOCK = Array.from({ length: 20 }, (_, i) => ({
  id: `app-${String(i + 1).padStart(3, "0")}`,
  date: `2026-04-${String(i + 1).padStart(2, "0")}`,
  score: 580 + Math.floor(Math.random() * 270),
  risk_tier: ["Low", "Medium-Low", "Medium-High", "High"][Math.floor(Math.random() * 4)],
  pd: +(Math.random() * 0.4).toFixed(3),
  fairness: Math.random() > 0.2,
}))

export default function ScoresPage() {
  const router = useRouter()
  const { data: scores } = useScores()
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<"date" | "score">("date")
  const [filterTier, setFilterTier] = useState("all")

  const raw = (scores ?? MOCK) as any[]
  const data = raw.map((s: any) => ({
    id: s.id ?? s.application_id ?? "",
    date: s.date ?? s.created_at?.slice(0, 10) ?? "",
    score: s.score ?? 0,
    risk_tier: s.risk_tier ?? "Medium-High",
    pd: s.pd ?? s.probability_of_default ?? 0,
    fairness: s.fairness ?? true,
  }))
  let filtered = filterTier === "all" ? data : data.filter(s => s.risk_tier === filterTier)
  filtered = [...filtered].sort((a, b) => sortBy === "date" ? (b.date || "").localeCompare(a.date || "") : b.score - a.score)
  const pages = Math.ceil(filtered.length / 10)
  const pageData = filtered.slice(page * 10, (page + 1) * 10)

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Score History</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger style={{ width: 160, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="score">Sort by Score</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTier} onValueChange={setFilterTier}>
          <SelectTrigger style={{ width: 180, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            {["Low", "Medium-Low", "Medium-High", "High"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, overflow: "hidden" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {["Date", "Score", "Risk Tier", "PD", "Fairness", ""].map(h => (
                <TableHead key={h} style={{ color: "var(--text-muted)" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((s, i) => (
              <TableRow key={i} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <TableCell style={{ color: `rgb(var(--text))` }}>{s.date}</TableCell>
                <TableCell style={{ color: scoreToColor(s.score), fontWeight: 600, fontFamily: "var(--font-palatino)" }}>{s.score}</TableCell>
                <TableCell><RiskTierBadge tier={s.risk_tier} /></TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{(s.pd * 100).toFixed(1)}%</TableCell>
                <TableCell style={{ color: s.fairness ? "#22c55e" : "#ef4444" }}>{s.fairness ? "✓ Pass" : "✗ Fail"}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/scores/${s.id}`)}
                    style={{ fontSize: 12, border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
          {Array.from({ length: pages }, (_, i) => (
            <Button key={i} variant={i === page ? "default" : "outline"} size="sm" onClick={() => setPage(i)}
              style={i === page ? { background: "var(--accent-gold)", color: "var(--bg-primary)" } : { border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
