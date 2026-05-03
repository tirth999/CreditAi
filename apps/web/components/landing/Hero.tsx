"use client"

import { useRef, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { CreditPolyhedron } from "@/components/three/CreditPolyhedron"
import { gsap } from "gsap"
import Link from "next/link"

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const tl = gsap.timeline({ delay: 0.3 })
    tl.from(eyebrowRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from(h1Ref.current, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
      .from(subRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        background: "var(--bg-void)",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas — right side */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "60%",
          height: "100%",
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
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <CreditPolyhedron />
          </Suspense>
        </Canvas>
      </div>

      {/* Content — left column */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 700,
          padding: "0 5vw",
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="t-eyebrow"
          style={{ marginBottom: 24 }}
        >
          CREDIT INTELLIGENCE
        </div>

        {/* H1 */}
        <h1
          ref={h1Ref}
          className="t-hero"
          style={{ marginBottom: 28 }}
        >
          YOUR CREDIT.
          <br />
          DECODED.
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            maxWidth: 440,
            marginBottom: 40,
          }}
        >
          AI-powered credit analysis. Know your score, fix your future.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/register" className="btn-primary">
            GET STARTED →
          </Link>
          <Link href="/demo" className="btn-ghost">
            VIEW DEMO
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="scroll-indicator" />
      </div>
    </section>
  )
}
