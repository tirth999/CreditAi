"use client"

import Link from "next/link"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Login", href: "/login" },
]

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "CCPA", href: "#" },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-void)",
        borderTop: "1px solid var(--border)",
        padding: "60px 5vw 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {/* Brand */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--text-primary)",
              letterSpacing: "0.05em",
              marginBottom: 12,
            }}
          >
            CREDIT AI
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--text-tertiary)",
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            Explainable & fair AI credit scoring research platform. CPSC 589 · CSUF.
          </p>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="t-card-label" style={{ marginBottom: 16 }}>
            NAVIGATION
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--text-tertiary)",
                  textDecoration: "none",
                  transition: "color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-tertiary)"
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="t-card-label" style={{ marginBottom: 16 }}>
            LEGAL
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--text-tertiary)",
                  textDecoration: "none",
                  transition: "color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-tertiary)"
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-tertiary)",
          }}
        >
          © 2026 CreditAI. CPSC 589 · Tirth Isamaliya · CSUF
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-tertiary)",
          }}
        >
          v2.0.0
        </span>
      </div>
    </footer>
  )
}
