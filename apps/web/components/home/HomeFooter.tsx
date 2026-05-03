"use client"

import Link from "next/link"

const COLS = [
  { title: "Product", links: [{ label: "Score Engine", href: "/dashboard" }, { label: "XAI Explorer", href: "/dashboard/xai-explorer" }, { label: "Fairness Audit", href: "/dashboard/fairness" }, { label: "Drift Monitor", href: "/dashboard/drift" }] },
  { title: "Research", links: [{ label: "7 Papers", href: "#research" }, { label: "Architecture", href: "#" }, { label: "API Docs", href: "http://localhost:8000/docs" }, { label: "Model Registry", href: "/dashboard/models" }] },
  { title: "Developer", links: [{ label: "GitHub", href: "https://github.com/tirth999/CreditAi" }, { label: "API Reference", href: "http://localhost:8000/docs" }, { label: "Local Setup", href: "#" }, { label: "Docker", href: "#" }] },
  { title: "Legal", links: [{ label: "Privacy Policy", href: "#" }, { label: "Terms", href: "#" }, { label: "GDPR", href: "#" }, { label: "Academic Use", href: "#" }] },
]

export default function HomeFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-surface)", padding: "72px 48px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr)", gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, letterSpacing: "0.12em", color: "var(--brand)", marginBottom: 16, fontWeight: 400 }}>CREDITAI</div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "var(--neutral)", maxWidth: 280, lineHeight: 1.75 }}>
              AI credit scoring platform built on 7 peer-reviewed papers. FCRA-compliant, fairness-first, fully explainable.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Link href="/register" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "var(--bg-primary)", padding: "8px 18px", borderRadius: 6, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Get Access
              </Link>
              <Link href="/login" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--neutral)", padding: "8px 18px", border: "1px solid var(--border)", borderRadius: 6, textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--neutral)" }}
              >
                Login
              </Link>
            </div>
          </div>

          {/* Cols */}
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: "var(--neutral)", textTransform: "uppercase", marginBottom: 20 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l.label} style={{ marginBottom: 12 }}>
                  <a href={l.href} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "var(--neutral)", textDecoration: "none", transition: "color 0.2s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--neutral)")}
                  >
                    {l.label}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "var(--neutral)", lineHeight: 1.7 }}>
            <div>CPSC 589 · Spring 2026 · Tirth Isamaliya · Dr. Kenneth Kung · CSUF</div>
            <div style={{ marginTop: 2 }}>© 2026 CreditAI. Built for academic research. Not for production lending.</div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--neutral)", letterSpacing: "0.06em" }}>v1.0.0 · Next.js 14 · FastAPI · XGBoost</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
