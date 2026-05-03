"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "./ScrollAnimations"

const STATS = [
  { final: 45, suffix: "M", label: "Credit-Invisible Americans", source: "CFPB 2015", color: "#c9a84c" },
  { final: 1.4, suffix: "B", label: "Adults Globally Unbanked", source: "World Bank 2022", color: "#8b5cf6" },
  { final: 7, suffix: "", label: "Open Problems — All Solved", source: "CreditAI 2026", color: "#6ee7b7" },
]

function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4) }

function CountUp({ final, suffix, color }: { final: number; suffix: string; color: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const duration = 2200
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          setVal(parseFloat((easeOutQuart(t) * final).toFixed(final < 10 ? 1 : 0)))
          if (t < 1) requestAnimationFrame(tick)
          else setVal(final)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [final])

  return (
    <div ref={ref} style={{
      fontFamily: "var(--font-palatino)",
      fontSize: "clamp(3rem,6vw,4.5rem)",
      background: `linear-gradient(135deg, ${color}, ${color}aa)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      lineHeight: 1,
      fontWeight: 300,
    }}>
      {val}{suffix}
    </div>
  )
}

export default function StatsBar() {
  return (
    <section style={{ padding: "80px 24px", position: "relative" }}>
      {/* Top gradient line */}
      <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(201,168,76,0.3), transparent)" }} />

      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 48 }}>
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.1}>
            <div style={{ textAlign: "center", flex: "1 1 220px" }}>
              <CountUp final={s.final} suffix={s.suffix} color={s.color} />
              <div style={{ fontSize: 15, color: `rgb(var(--text))`, marginTop: 10, fontWeight: 300 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{s.source}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Bottom gradient line */}
      <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }} />
    </section>
  )
}
