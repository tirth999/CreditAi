"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"

const ScoreSphere = dynamic(() => import("@/components/three/ScoreSphere"), { ssr: false })

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -80])
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <section ref={ref} style={{ minHeight: "100dvh", display: "flex", alignItems: "center", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "140px 48px 80px", display: "grid", gridTemplateColumns: "1fr auto", gap: 80, alignItems: "center" }}>

        {/* Left — Text */}
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 28 }}
          >
            AI-Powered Credit Intelligence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(60px, 8vw, 96px)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1.03,
              color: "var(--brand)",
              marginBottom: 28,
            }}
          >
            Know Who<br />to Trust.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 17, color: "var(--neutral)", lineHeight: 1.75, maxWidth: 500, marginBottom: 44 }}
          >
            CreditAI delivers explainable, fair, real-time credit scoring — built on 7 peer-reviewed research papers with full regulatory compliance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}
          >
            <Link href="/register" className="btn-primary">
              Get Early Access
            </Link>
            <Link href="#how-it-works"
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--neutral)",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--neutral)")}
            >
              See How It Works →
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — 3D Sphere */}
        <motion.div
          className="hidden lg:flex"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <ScoreSphere score={742} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: indicatorOpacity, position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "var(--neutral)", textTransform: "uppercase" }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 28, background: "var(--accent)" }}
        />
      </motion.div>
    </section>
  )
}
