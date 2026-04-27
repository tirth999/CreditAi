"use client"

import { useEffect, useRef, useState } from "react"

const STATS = [
  { final: 45, suffix: "M", label: "Credit-Invisible Americans", source: "CFPB 2015" },
  { final: 1.4, suffix: "B", label: "Adults Globally Unbanked", source: "World Bank 2022" },
  { final: 7, suffix: "", label: "Open Problems — All Solved", source: "CreditAI 2026" },
]

function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4) }

function CountUp({ final, suffix }: { final: number; suffix: string }) {
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
        const duration = 2000
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
    <div ref={ref} style={{ fontFamily: "var(--font-palatino)", fontSize: "clamp(3rem,6vw,5rem)", color: "var(--accent-gold)", lineHeight: 1, fontWeight: 300 }}>
      {val}{suffix}
    </div>
  )
}

export default function StatsBar() {
  return (
    <section style={{ background: "var(--glass-bg)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)", padding: "64px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 48 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ textAlign: "center", flex: "1 1 200px" }}>
            <CountUp final={s.final} suffix={s.suffix} />
            <div style={{ fontSize: 15, color: `rgb(var(--text))`, marginTop: 8, fontWeight: 300 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.source}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
