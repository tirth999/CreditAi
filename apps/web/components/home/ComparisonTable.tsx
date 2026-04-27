"use client"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const ROWS = [
  { cap: "Predictive Accuracy (AUC)", trad: "~0.70", w1: "~0.78", w2: "~0.82", ai: "~0.85+" },
  { cap: "Explainability",       trad: "✓ Simple",     w1: "Partial",   w2: "✗ Opaque",      ai: "✓ Regulatory-grade" },
  { cap: "Fairness Metrics",     trad: "✗ None",       w1: "✗ None",    w2: "✗ None",         ai: "✓ 5 metrics" },
  { cap: "Privacy Preserving",   trad: "N/A",          w1: "✗ No",      w2: "✗ No",           ai: "✓ Federated + DP" },
  { cap: "Thin-File / Alt Data", trad: "✗ No",         w1: "✗ Partial", w2: "✓ Partial",      ai: "✓ Full" },
  { cap: "Drift Detection",      trad: "✗ No",         w1: "✗ No",      w2: "✗ No",           ai: "✓ PSI + ADWIN" },
  { cap: "Regulatory Compliance",trad: "✓ FCRA",       w1: "Partial",   w2: "✗ Gap",          ai: "✓ ECOA + GDPR + EU AI Act" },
  { cap: "Adverse Action Notice",trad: "✓ Manual",     w1: "✗ No",      w2: "✗ No",           ai: "✓ Auto-generated" },
]

function Cell({ val, gold = false }: { val: string; gold?: boolean }) {
  const isGood = val.startsWith("✓")
  const isBad  = val.startsWith("✗")
  const cls = isGood
    ? { background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 6, padding: "2px 10px", fontSize: 12, display: "inline-block", whiteSpace: "nowrap" as const }
    : isBad
    ? { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "2px 10px", fontSize: 12, display: "inline-block", whiteSpace: "nowrap" as const }
    : { fontSize: 13, color: gold ? "var(--accent-gold)" : "var(--text-muted)", display: "inline-block" }
  return <span style={cls}>{val}</span>
}

export default function ComparisonTable() {
  return (
    <section style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, letterSpacing: "-0.02em", textAlign: "center", color: `rgb(var(--text))`, marginBottom: 16 }}>
          See the Difference
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 16, marginBottom: 48 }}>
          How CreditAI stacks up against every generation of credit scoring.
        </p>
        <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, overflow: "hidden" }}>
          <Table>
            <TableHeader>
              <TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <TableHead style={{ color: `rgb(var(--text))`, fontFamily: "var(--font-palatino)", fontSize: 15, padding: "16px 20px" }}>Capability</TableHead>
                <TableHead style={{ color: "var(--text-muted)", padding: "16px 20px", fontSize: 13 }}>Traditional FICO</TableHead>
                <TableHead style={{ color: "var(--text-muted)", padding: "16px 20px", fontSize: 13 }}>Wave 1 XGBoost</TableHead>
                <TableHead style={{ color: "var(--text-muted)", padding: "16px 20px", fontSize: 13 }}>Wave 2 Deep Learning</TableHead>
                <TableHead style={{ color: "var(--accent-gold)", padding: "16px 20px", fontSize: 13, background: "rgba(201,168,76,0.08)", borderLeft: "1px solid rgba(201,168,76,0.25)", borderRight: "1px solid rgba(201,168,76,0.25)" }}>
                  ★ CreditAI
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row, i) => (
                <TableRow key={i} style={{ borderBottom: "1px solid var(--glass-border)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>
                  <TableCell style={{ color: `rgb(var(--text))`, fontWeight: 500, padding: "14px 20px", fontSize: 14 }}>{row.cap}</TableCell>
                  <TableCell style={{ padding: "14px 20px" }}><Cell val={row.trad} /></TableCell>
                  <TableCell style={{ padding: "14px 20px" }}><Cell val={row.w1} /></TableCell>
                  <TableCell style={{ padding: "14px 20px" }}><Cell val={row.w2} /></TableCell>
                  <TableCell style={{ padding: "14px 20px", background: "rgba(201,168,76,0.04)", borderLeft: "1px solid rgba(201,168,76,0.2)", borderRight: "1px solid rgba(201,168,76,0.2)" }}><Cell val={row.ai} gold /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
