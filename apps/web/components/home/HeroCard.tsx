"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

/* ─── Theme Toggle ─────────────────────────────────────────── */
function ThemeToggle() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = saved ?? (prefersDark ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", initial)
    setDark(initial === "dark")
  }, [])
  const toggle = () => {
    const next = dark ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
    setDark(!dark)
  }
  return (
    <button id="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {dark ? (
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
  )
}

/* ─── Navbar ────────────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: scrolled ? "var(--glass-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(40px)" : "none",
        borderBottom: scrolled ? "1px solid var(--glass-border)" : "none",
        transition: "all 400ms ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        {/* Logo */}
        <span style={{ fontFamily: "var(--font-palatino)", fontSize: 20, letterSpacing: "0.15em", color: `rgb(var(--text))`, fontWeight: 400 }}>
          CREDITAI
        </span>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
          {["About", "Features", "Pricing", "Blog"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "opacity 300ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = `rgb(var(--text))`)}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >{l}</a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none" }}>Login</Link>
          <Link href="/register" style={{
            background: "rgba(var(--text),0.08)",
            border: "1px solid rgba(var(--text),0.15)",
            backdropFilter: "blur(12px)",
            borderRadius: 100,
            padding: "8px 20px",
            fontSize: 14,
            color: `rgb(var(--text))`,
            textDecoration: "none",
            transition: "all 200ms",
          }}>Open Account</Link>
          <ThemeToggle />
          {/* Hamburger */}
          <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: `rgb(var(--text))`, padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", borderTop: "1px solid var(--glass-border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {["About", "Features", "Pricing", "Blog"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ fontSize: 15, color: `rgb(var(--text))`, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  )
}

/* ─── 3D Credit Card ─────────────────────────────────────────── */
function CreditCard3D() {
  const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!cardRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * -15
      cardRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateY(-10px)`
      cardRef.current.style.transition = "transform 100ms linear"
    }
    window.addEventListener("mousemove", fn)
    return () => window.removeEventListener("mousemove", fn)
  }, [])

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: 400, height: 400,
        background: "radial-gradient(ellipse, var(--glow) 0%, transparent 70%)",
        transform: "translate(-50%,-50%)", top: "50%", left: "50%", pointerEvents: "none",
      }} />
      <div className="card-scene">
        <div className="card-3d" ref={cardRef}>
          <div className="card-face">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div className="chip" />
              <svg width="48" height="30" viewBox="0 0 48 30">
                <circle cx="18" cy="15" r="14" fill="rgba(201,168,76,0.8)" />
                <circle cx="30" cy="15" r="14" fill="rgba(201,168,76,0.5)" />
              </svg>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.15em", marginBottom: 6 }}>CARD NUMBER</div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontFamily: "monospace", fontSize: 15, letterSpacing: "0.2em" }}>•••• •••• •••• 4291</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.15em" }}>CARD HOLDER</div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 2, fontFamily: "var(--font-palatino)" }}>TIRTH ISAMALIYA</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.15em" }}>EXPIRES</div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 2 }}>12/28</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCard3D

export { Navbar, ThemeToggle }
