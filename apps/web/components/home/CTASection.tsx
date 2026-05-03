"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CTASection() {
  return (
    <section style={{ padding: "140px 48px", background: "var(--bg-raised)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(52px, 7vw, 80px)",
            fontWeight: 300,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: "var(--brand)",
            marginBottom: 40,
          }}
        >
          Ready to lend<br />with confidence?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
        >
          <Link href="/register"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, fontWeight: 600,
              background: "var(--accent)",
              color: "var(--bg-primary)",
              borderRadius: 8, padding: "18px 48px",
              textDecoration: "none",
              border: "none",
              display: "inline-block",
              letterSpacing: "-0.01em",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "" }}
          >
            Request Access
          </Link>

          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "var(--neutral)", letterSpacing: "0.01em" }}>
            No credit card required · GDPR compliant · SOC 2 certified
          </p>
        </motion.div>
      </div>
    </section>
  )
}
