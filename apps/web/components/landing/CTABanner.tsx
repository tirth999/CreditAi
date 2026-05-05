"use client"

import { Suspense, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { CreditPolyhedron } from "@/components/three/CreditPolyhedron"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cta"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "var(--bg-void)",
        padding: "80px 5vw",
        overflow: "hidden",
      }}
    >
      {/* Background 3D — low opacity icosahedron */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.15,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <CreditPolyhedron />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div
        className="cta-content"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 100px)",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            color: "var(--text-primary)",
            marginBottom: 24,
          }}
        >
          EXPLORE THE
          <br />
          PLATFORM
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--text-secondary)",
            marginBottom: 40,
          }}
        >
          Transparent scoring. Auditable decisions. Regulatory-ready AI.
        </p>
        <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: "16px 48px" }}>
          GET STARTED →
        </Link>
      </div>
    </section>
  )
}
