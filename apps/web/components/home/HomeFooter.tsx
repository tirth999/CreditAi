"use client"

import Link from "next/link"

const COLS = [
  {
    title: "Product",
    links: ["Score Engine", "XAI Explorer", "Fairness Audit", "Drift Monitor"],
  },
  {
    title: "Research",
    links: ["7 Papers", "Architecture", "API Docs", "Model Registry"],
  },
  {
    title: "Developer",
    links: ["GitHub", "API Reference", "Local Setup", "Docker"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms", "GDPR", "Academic Use"],
  },
]

export default function HomeFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--glass-border)", background: "var(--bg-secondary)", padding: "72px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "var(--font-palatino)", fontSize: 22, letterSpacing: "0.15em", color: "var(--accent-gold)", marginBottom: 12 }}>CREDITAI</div>
          <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 360, lineHeight: 1.7 }}>
            AI credit scoring platform built on 7 peer-reviewed papers. FCRA-compliant, fairness-first, fully explainable.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, marginBottom: 56 }}>
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "var(--font-palatino)", fontSize: 15, color: `rgb(var(--text))`, marginBottom: 18 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "color 200ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            <div>CPSC 589 · Spring 2026 · Tirth Isamaliya · Dr. Kenneth Kung · California State University Fullerton</div>
            <div style={{ marginTop: 4 }}>© 2026 CreditAI. Built for academic research.</div>
          </div>
          <Link href="/demo" style={{ fontSize: 13, color: "var(--accent-gold)", textDecoration: "none" }}>
            Try Live Demo →
          </Link>
        </div>
      </div>
    </footer>
  )
}
