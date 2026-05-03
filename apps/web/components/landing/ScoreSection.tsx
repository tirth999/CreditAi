"use client"

import { useRef, useEffect, useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { ScoreTorus } from "@/components/three/ScoreTorus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const SCORE = 742
const BREAKDOWN = [
  { label: "PAYMENT HISTORY", value: "98%", font: "var(--font-mono)" },
  { label: "CREDIT AGE", value: "7Y 4M", font: "var(--font-mono)" },
  { label: "UTILIZATION", value: "24%", font: "var(--font-mono)" },
]

export default function ScoreSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const [torusProgress, setTorusProgress] = useState(0)
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReduced) {
      setTorusProgress(1)
      setScoreDisplay(SCORE)
      setIsVisible(true)
      return
    }

    const ctx = gsap.context(() => {
      // Pinned scroll section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          onEnter: () => setIsVisible(true),
        },
      })

      // Animate torus arc
      const progressObj = { val: 0 }
      tl.to(progressObj, {
        val: 1,
        duration: 1,
        onUpdate: () => setTorusProgress(progressObj.val),
      })

      // Counter animation (not scrub — one-shot)
      const counterObj = { val: 0 }
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        onEnter: () => {
          gsap.to(counterObj, {
            val: SCORE,
            duration: 2.0,
            ease: "power2.out",
            onUpdate: () => setScoreDisplay(Math.round(counterObj.val)),
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="score-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-surface)",
        position: "relative",
        padding: "80px 5vw",
      }}
    >
      {/* 3D Torus Canvas behind the score */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ScoreTorus score={SCORE} progress={torusProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Score number */}
      <div
        ref={scoreRef}
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(120px, 20vw, 240px)",
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            color: "var(--text-primary)",
          }}
        >
          {scoreDisplay}
        </div>

        <div
          className="t-eyebrow"
          style={{ marginTop: 16, marginBottom: 48 }}
        >
          GOOD STANDING
        </div>
      </div>

      {/* 3-column breakdown */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: 0,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.9s ease 0.8s, transform 0.9s ease 0.8s",
        }}
      >
        {BREAKDOWN.map((item, i) => (
          <div
            key={item.label}
            style={{
              textAlign: "center",
              padding: "0 40px",
              borderRight: i < BREAKDOWN.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              {item.value}
            </div>
            <div className="t-card-label">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
