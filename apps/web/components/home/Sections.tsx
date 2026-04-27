"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

/* Scroll reveal hook */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── Marquee Strip ─────────────────────────────────── */
export function MarqueeStrip() {
  const logos = ["attracts", "exon", "elio", "relax", "olab", "nexus", "finvest", "alphabank", "attracts", "exon", "elio", "relax", "olab", "nexus", "finvest", "alphabank"]
  return (
    <div style={{
      overflow: "hidden", padding: "20px 0",
      background: "var(--glass-bg)", backdropFilter: "blur(16px)",
      borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)",
    }}>
      <div className="marquee-track">
        {logos.map((l, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-palatino)", fontSize: 18, letterSpacing: "0.12em",
            opacity: 0.35, whiteSpace: "nowrap", textTransform: "uppercase",
            color: `rgb(var(--text))`, transition: "opacity 300ms", cursor: "default",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.35")}
          >{l}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── CSS Bar Chart (animated) ─────────────────────── */
export function MiniBarChart({ bars = [60, 85, 45, 90, 70] }: { bars?: number[] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 4, height: `${h}%`,
          background: `linear-gradient(180deg, var(--accent-gold) 0%, rgba(201,168,76,0.3) 100%)`,
          transformOrigin: "bottom", animation: `bar-grow 0.8s ease-out ${i * 0.1}s both`,
        }} />
      ))}
    </div>
  )
}

/* ─── Donut Chart ───────────────────────────────────── */
export function DonutChart() {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div className="donut" />
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))` }}>68%</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>health</div>
      </div>
    </div>
  )
}

/* ─── SVG Sparkline ─────────────────────────────────── */
export function Sparkline() {
  return (
    <svg viewBox="0 0 200 60" style={{ width: "100%", height: 60 }}>
      <polyline
        points="0,50 40,30 80,40 120,10 160,25 200,5"
        fill="none"
        stroke="var(--accent-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="300"
        strokeDashoffset="300"
      >
        <animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.5s" fill="freeze" />
      </polyline>
    </svg>
  )
}

/* ─── Bento — Confidence Section ────────────────────── */
export function ConfidenceSection() {
  return (
    <section id="features" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: `rgb(var(--text))`, marginBottom: 16 }}>
          Bank with Complete Confidence
        </h2>
        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
          Real-time AI scoring with fairness guarantees and full explainability built in.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        {/* Card A */}
        <div className="glass reveal" style={{ padding: 36, minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))`, marginBottom: 12 }}>
              Weekly Transaction Dynamics
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 28 }}>
              Track your spending velocity with neural-powered pattern recognition across 40+ signals.
            </p>
          </div>
          <div>
            <MiniBarChart />
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 20, fontSize: 13, color: "var(--accent-gold)", textDecoration: "none" }}>
              Learn More →
            </a>
          </div>
        </div>

        {/* Card B */}
        <div className="glass reveal" style={{
          minHeight: 380, position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg,rgba(12,16,30,0.8),rgba(15,52,96,0.6))",
        }}>
          <div style={{ padding: 36 }}>
            <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))`, marginBottom: 12 }}>
              Your Financial Snapshot
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.75 }}>
              Aggregate risk signals into a single actionable number.
            </p>
          </div>
          {/* Floating metric */}
          <div style={{
            position: "absolute", bottom: 36, left: 36, right: 36,
            background: "var(--glass-bg)", backdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)", borderRadius: 16, padding: "20px 24px",
          }}>
            <div style={{ fontFamily: "var(--font-palatino)", fontSize: 32, color: "var(--accent-gold)" }}>$15,437</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Available Credit Line</div>
            <div style={{ marginTop: 12 }}><Sparkline /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Mind-Blow Section ─────────────────────────────── */
export function MindBlowSection() {
  return (
    <section style={{
      padding: "100px 24px",
      background: "var(--glass-bg)", backdropFilter: "blur(16px)",
      borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40, alignItems: "center" }}>
        {/* Left floating card */}
        <div className="glass reveal animate-float" style={{ padding: 28 }}>
          <div style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: "var(--accent-gold)" }}>$521K</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Portfolio Managed</div>
          <Sparkline />
        </div>

        {/* Center headline */}
        <div className="reveal" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: `rgb(var(--text))`, marginBottom: 20, lineHeight: 1.15 }}>
            Who Says Banking Can't Blow Your Mind?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 28px" }}>
            AI-driven insights that feel magical yet remain fully explainable and FCRA-compliant.
          </p>
          <Link href="/register" style={{
            display: "inline-block", padding: "14px 32px", borderRadius: 12,
            background: `rgba(var(--text),0.9)`, color: "var(--bg-primary)",
            fontWeight: 500, fontSize: 14, textDecoration: "none", letterSpacing: "0.02em",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)" }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "" }}
          >Get Started Free</Link>
        </div>

        {/* Right transaction card */}
        <div className="glass reveal" style={{ padding: 28 }}>
          {[
            { label: "Mortgage Payment", amount: "-$2,150", positive: false },
            { label: "Salary Deposit", amount: "+$6,800", positive: true },
            { label: "Investment Return", amount: "+$340", positive: true },
            { label: "Utility Bill", amount: "-$89", positive: false },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--glass-border)" : "none" }}>
              <span style={{ fontSize: 13, color: `rgb(var(--text))` }}>{t.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.positive ? "#22c55e" : "#ef4444" }}>{t.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features Bento ────────────────────────────────── */
export function FeaturesBento() {
  return (
    <section id="about" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: `rgb(var(--text))`, marginBottom: 16 }}>
          Streamline Finance, Zero Hassle
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        {/* Card 1 — Payments */}
        <div className="glass reveal" style={{ padding: 36 }}>
          <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 16 }}>Send & Receive Seamlessly</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            {[{ label: "$119.94", dir: "out" }, { label: "→", dir: "arrow" }, { label: "$199.94", dir: "in" }].map((item, i) => (
              item.dir === "arrow"
                ? <span key={i} style={{ color: "var(--accent-gold)", fontSize: 20 }}>→</span>
                : <div key={i} style={{
                  padding: "8px 16px", borderRadius: 100,
                  background: item.dir === "out" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                  color: item.dir === "out" ? "#ef4444" : "#22c55e",
                  fontSize: 14, fontWeight: 600,
                }}>{item.label}</div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.75 }}>
            Instant transfers with AI fraud detection running at sub-50ms latency.
          </p>
        </div>

        {/* Card 2 — Donut */}
        <div className="glass reveal" style={{ padding: 36, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 24 }}>Organize Your Finances</h3>
          <DonutChart />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 20, width: "100%" }}>
            {[["Income","#c9a84c"],["Insurance","#4a9eff"],["Emergency","#ff6b6b"],["Savings","rgba(255,255,255,0.2)"]].map(([l,c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 — Stacked cards */}
        <div className="glass reveal" style={{ padding: 36, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 28, textAlign: "center" }}>Unlock Cards Earlier</h3>
          <div style={{ position: "relative", width: 200, height: 120 }}>
            {[{ rotate: -5, z: 1, bg: "linear-gradient(135deg,#1a1a2e,#0f3460)" }, { rotate: 5, z: 2, bg: "linear-gradient(135deg,#16213e,#1a1a2e)" }].map((card, i) => (
              <div key={i} style={{
                position: "absolute", inset: 0, borderRadius: 14,
                background: card.bg, border: "1px solid rgba(255,255,255,0.12)",
                transform: `rotate(${card.rotate}deg)`,
                zIndex: card.z, boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "flex-end", padding: 14,
                transition: "transform 300ms ease",
              }}>
                <div className="chip" style={{ width: 32, height: 24 }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.75, textAlign: "center", marginTop: 28 }}>
            AI-powered credit building programs unlock premium cards faster.
          </p>
        </div>
      </div>
    </section>
  )
}
