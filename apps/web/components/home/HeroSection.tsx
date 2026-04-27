"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import ScoreGauge from "@/components/charts/ScoreGauge"

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <section ref={ref} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
      {/* Animated grid BG */}
      <motion.div style={{ position: "absolute", inset: 0, y: bgY, pointerEvents: "none" }}>
        <svg width="100%" height="130%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 600, background: "radial-gradient(ellipse, var(--glow) 0%, transparent 70%)", pointerEvents: "none" }} />
      </motion.div>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "120px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "center" }}>
          {/* Left */}
          <div style={{ maxWidth: 640 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.1)", borderRadius: 100, padding: "6px 16px", fontSize: 12, letterSpacing: "0.05em", color: "var(--accent-gold)" }}>
              <BookOpen size={12} />
              Built on 7 peer-reviewed papers · CPSC 589 · CSUF
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(3rem,8vw,5.5rem)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.08, color: `rgb(var(--text))`, marginBottom: 24 }}>
              Credit Intelligence,<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent-gold-light), var(--accent-gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Rebuilt for the AI Age
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 540, marginBottom: 40 }}>
              The only platform that solves all 7 open research challenges in credit risk AI — fairness auditing, regulatory-grade XAI, concept drift, federated privacy, financial inclusion, GNN risk modeling, and transformer NLP.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/register"
                style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.01em", transition: "transform 200ms, box-shadow 200ms" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(201,168,76,0.3)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "" }}>
                Start Scoring →
              </Link>
              <Link href="#research"
                style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10, padding: "14px 28px", fontSize: 15, textDecoration: "none", transition: "all 200ms", background: "var(--glass-bg)", backdropFilter: "blur(12px)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-gold)"; (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)"; (e.currentTarget as HTMLElement).style.color = `rgb(var(--text))` }}>
                View Research
              </Link>
            </motion.div>
          </div>

          {/* Right — floating preview card */}
          <div className="hidden lg:block">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px) saturate(180%)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, width: 280, boxShadow: "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 var(--glass-highlight)" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <ScoreGauge score={742} size={120} />
                <div style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: "#22c55e", marginTop: 8 }}>742</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Very Good</div>
              </div>
              {[
                { label: "Payment History", value: 0.15, positive: true },
                { label: "Income Level",    value: 0.12, positive: true },
                { label: "Credit Util.",    value: -0.08, positive: false },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.positive ? "#14b8a6" : "#ef4444" }}>{item.positive ? "+" : ""}{item.value.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--glass-border)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", height: "100%", borderRadius: 2, width: `${Math.abs(item.value) * 333}%`, background: item.positive ? "#14b8a6" : "#ef4444", left: item.positive ? "50%" : `${50 - Math.abs(item.value) * 333}%` }} />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", borderRadius: 8, padding: "8px 12px", marginTop: 12 }}>
                <span style={{ color: "#22c55e", fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 12, color: "#22c55e" }}>Fairness Passed</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
