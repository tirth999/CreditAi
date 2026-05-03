"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const STATS = [
  { value: "94%", label: "SCORE IMPROVEMENT RATE" },
  { value: "2.3M+", label: "PROFILES ANALYZED" },
  { value: "48hrs", label: "AVERAGE FIRST RESULT" },
]

export default function StatsBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.15,
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="stats"
      style={{
        background: "var(--accent)",
        padding: "100px 5vw",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-item"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0 40px",
              borderRight:
                i < STATS.length - 1
                  ? "1px solid var(--bg-hover)"
                  : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(60px, 10vw, 120px)",
                fontWeight: 700,
                color: "var(--bg-void)",
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--bg-void)",
                opacity: 0.6,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
