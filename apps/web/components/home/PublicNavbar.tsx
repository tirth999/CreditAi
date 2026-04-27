"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Research", href: "#research" },
  { label: "Demo", href: "/demo" },
]

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = saved ?? (prefersDark ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", initial)
    setTheme(initial)
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64,
      background: scrolled ? "var(--glass-bg)" : "transparent",
      backdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
      borderBottom: scrolled ? "1px solid var(--glass-border)" : "none",
      transition: "all 400ms ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: "var(--font-palatino)", fontSize: 22, letterSpacing: "0.15em", color: "var(--accent-gold)", fontWeight: 400, textDecoration: "none" }}>
          CREDITAI
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "color 300ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >{l.label}</Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <div className="hidden md:flex" style={{ gap: 8, alignItems: "center" }}>
            <Link href="/login" style={{
              fontSize: 14, color: "var(--text-muted)", textDecoration: "none",
              padding: "8px 16px", border: "1px solid var(--glass-border)",
              borderRadius: 8, transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = `rgb(var(--text))`; e.currentTarget.style.borderColor = "var(--accent-gold)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--glass-border)" }}
            >Login</Link>
            <Link href="/register" style={{
              fontSize: 14, fontWeight: 600, color: "var(--bg-primary)",
              background: "var(--accent-gold)", textDecoration: "none",
              padding: "8px 20px", borderRadius: 8, transition: "opacity 200ms",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Open Account</Link>
          </div>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: `rgb(var(--text))`, padding: 4 }}>
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", width: 280, padding: "32px 24px" }}>
              <div style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: "var(--accent-gold)", marginBottom: 32, letterSpacing: "0.1em" }}>CREDITAI</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_LINKS.map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: 16, color: `rgb(var(--text))`, textDecoration: "none", padding: "12px 0", borderBottom: "1px solid var(--glass-border)" }}>{l.label}</Link>
                ))}
                <Link href="/login" style={{ marginTop: 24, fontSize: 15, color: "var(--text-muted)", textDecoration: "none" }}>Login →</Link>
                <Link href="/register" style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: "var(--bg-primary)", background: "var(--accent-gold)", textDecoration: "none", padding: "12px 20px", borderRadius: 8, textAlign: "center" }}>Open Account</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
