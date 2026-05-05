"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Research", href: "#research" },
]

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState("light")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = saved ?? (prefersDark ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", initial)
    setTheme(initial)
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        background: scrolled ? "var(--bg-surface)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>

          {/* Logo */}
          <Link href="/" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20, letterSpacing: "0.12em",
            color: "var(--brand)", fontWeight: 400, textDecoration: "none",
          }}>
            CREDITAI
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.label} href={l.href}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, fontWeight: 400,
                  color: "var(--neutral)", textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--neutral)")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Theme toggle */}
            <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--neutral)" }}>
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--neutral)" }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <Link href="/login" className="nav-desktop-links" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, color: "var(--neutral)",
              textDecoration: "none", padding: "8px 18px",
              border: "1px solid var(--border)", borderRadius: 6,
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--neutral)" }}
            >
              Login
            </Link>

            <Link href="/register" className="nav-desktop-links" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 600,
              color: "var(--bg-primary)",
              background: "var(--accent)",
              textDecoration: "none",
              padding: "8px 20px", borderRadius: 6,
              transition: "opacity 0.2s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Open Account
            </Link>

            {/* Mobile */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", padding: 4 }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "var(--bg-surface)", borderBottom: "1px solid var(--border)",
          padding: "24px 48px",
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "var(--brand)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid var(--border)" }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Link href="/login" className="btn-ghost" style={{ flex: 1, textAlign: "center" }} onClick={() => setMobileOpen(false)}>Login</Link>
            <Link href="/register" className="btn-primary" style={{ flex: 1, textAlign: "center" }} onClick={() => setMobileOpen(false)}>Open Account</Link>
          </div>
        </div>
      )}
    </>
  )
}
