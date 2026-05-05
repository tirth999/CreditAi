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
  { label: "MODEL AUC", value: "0.94", font: "var(--font-mono)" },
  { label: "FAIRNESS INDEX", value: "0.92", font: "var(--font-mono)" },
  { label: "PREDICTION COVERAGE", value: "95%", font: "var(--font-mono)" },
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

      const progressObj = { val: 0 }
      tl.to(progressObj, {
        val: 1,
        duration: 1,
        onUpdate: () => setTorusProgress(progressObj.val),
      })

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

      <div
        style={{
          position: "relative",
          width: "min(100vw, 450px)",
          height: "min(100vw, 450px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <div
          style={{
            position: "absolute",
            inset: 0,
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


        <div
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 1s ease 0.4s",
            animation: isVisible ? "pulseRing 3s ease-in-out infinite" : "none",
          }}
          aria-hidden="true"
        />


        <div
          style={{
            position: "absolute",
            inset: "4%",
            borderRadius: "50%",
            border: "1px dashed var(--border)",
            opacity: isVisible ? 0.5 : 0,
            transition: "opacity 1s ease 0.6s",
            animation: isVisible ? "rotateOrbit 30s linear infinite" : "none",
          }}
          aria-hidden="true"
        />




        <div
          ref={scoreRef}
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 12vw, 140px)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "var(--text-primary)",
            }}
          >
            {scoreDisplay}
          </div>

          <div
            className="t-eyebrow"
            style={{ marginTop: 16 }}
          >
            LOW RISK TIER
          </div>
        </div>
      </div>


      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: 0,
          marginTop: 48,
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


      <style>{`
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.04); opacity: 0.15; }
        }
        @keyframes rotateOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

      `}</style>
    </section>
  )
}
