"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const ParticleCloud = dynamic(() => import("@/components/three/ParticleCloud"), { ssr: false })

const STATS = [
  { value: 98.7, suffix: "%",  label: "Model Accuracy",         sub: "XGBoost ensemble · 5-fold CV" },
  { value: 2.4,  suffix: "M",  label: "Credit Profiles Trained", sub: "CFPB + Kaggle + synthetic data" },
  { value: 120,  prefix: "<\u202f", suffix: "ms", label: "Average Decision Time", sub: "End-to-end scoring pipeline" },
]

function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4) }

function CountUp({ value, suffix, prefix = "" }: { value: number; suffix: string; prefix?: string }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const duration = 1500
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const v = easeOutQuart(t) * value
          setDisplay(value % 1 === 0 ? Math.round(v).toString() : v.toFixed(1))
          if (t < 1) requestAnimationFrame(tick)
          else setDisplay(value.toString())
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "clamp(44px, 5.5vw, 68px)",
        fontWeight: 500,
        color: "var(--brand)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {prefix}{display}{suffix}
    </div>
  )
}

export default function StatsSection() {
  return (
    <section style={{
      background: "var(--bg-primary)",
      borderTop: "1px solid var(--border)",
      overflow: "hidden",
    }}>

      {/* ── Row 1: Particle cloud — its own dedicated band ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 48px 48px",
        gap: 16,
        background: "var(--bg-raised)",
        position: "relative",
        overflow: "hidden",
      }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--neutral)",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          Trained on 2.4M credit profiles
        </motion.p>

        {/* Particle cloud — visually contained, not overlapping anything */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "relative", zIndex: 0 }}
        >
          <ParticleCloud width={700} height={220} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13,
            color: "var(--neutral)",
            textAlign: "center",
            maxWidth: 460,
            lineHeight: 1.65,
            position: "relative",
            zIndex: 1,
          }}
        >
          Each point represents one loan applicant. Hover to accelerate the simulation.
        </motion.p>
      </div>

      {/* ── Row 2: Stat cards — clean, no cloud ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--bg-surface)",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
                padding: "52px 44px 44px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <CountUp value={s.value} suffix={s.suffix} prefix={s.prefix} />
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--brand)",
                letterSpacing: "-0.01em",
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "var(--neutral)",
                letterSpacing: "0.04em",
              }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  )
}
