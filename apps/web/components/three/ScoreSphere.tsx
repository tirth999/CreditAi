"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScoreSphereProps {
  score?: number
  isDark?: boolean
}

export default function ScoreSphere({ score = 742, isDark = true }: ScoreSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.35])
  const x = useTransform(scrollYProgress, [0, 0.3], [0, 320])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    const cx = 200, cy = 200, r = 160
    let time = 0
    let rotY = 0

    function drawSphere() {
      if (!ctx) return
      ctx.clearRect(0, 0, 400, 400)

      // Background glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      if (isDark) {
        grd.addColorStop(0, "rgba(212,180,122,0.08)")
        grd.addColorStop(1, "transparent")
      } else {
        grd.addColorStop(0, "rgba(26,26,46,0.06)")
        grd.addColorStop(1, "transparent")
      }
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 400, 400)

      const sphereColor = isDark ? "#D4B47A" : "#1A1A2E"
      const lineColor = isDark ? "rgba(212,180,122,0.18)" : "rgba(26,26,46,0.14)"
      const highlightColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.5)"

      // Draw sphere body
      const bodyGrd = ctx.createRadialGradient(cx - 40, cy - 50, 10, cx, cy, r)
      if (isDark) {
        bodyGrd.addColorStop(0, "#E8D5A3")
        bodyGrd.addColorStop(0.4, "#C8A96E")
        bodyGrd.addColorStop(1, "#6B4F2A")
      } else {
        bodyGrd.addColorStop(0, "#3A3A5E")
        bodyGrd.addColorStop(0.4, "#1A1A2E")
        bodyGrd.addColorStop(1, "#050510")
      }
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = bodyGrd
      ctx.fill()

      // Latitude lines
      const numLat = 8
      for (let i = 1; i < numLat; i++) {
        const lat = (i / numLat) * Math.PI - Math.PI / 2
        const cosLat = Math.cos(lat)
        const sinLat = Math.sin(lat)
        const yr = cy + sinLat * r
        const xr = cosLat * r
        if (Math.abs(yr - cy) < r) {
          ctx.beginPath()
          ctx.ellipse(cx, yr, xr, xr * 0.28, 0, 0, Math.PI * 2)
          ctx.strokeStyle = lineColor
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // Longitude lines (rotating)
      const numLon = 10
      for (let i = 0; i < numLon; i++) {
        const angle = (i / numLon) * Math.PI + rotY
        const x1 = cx + Math.sin(angle) * r * 0.15
        ctx.beginPath()
        ctx.ellipse(cx, cy, Math.abs(Math.cos(angle)) * r, r, 0, 0, Math.PI * 2)
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      // Specular highlight
      const hlGrd = ctx.createRadialGradient(cx - 55, cy - 55, 2, cx - 40, cy - 40, 70)
      hlGrd.addColorStop(0, highlightColor)
      hlGrd.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = hlGrd
      ctx.fill()

      // Gold accent light (bottom-left point light)
      const accentGrd = ctx.createRadialGradient(cx + 80, cy + 90, 10, cx + 60, cy + 70, 100)
      accentGrd.addColorStop(0, isDark ? "rgba(91,156,196,0.2)" : "rgba(44,95,138,0.15)")
      accentGrd.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = accentGrd
      ctx.fill()

      rotY += 0.003
      time += 0.016
    }

    function loop() {
      drawSphere()
      animRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => cancelAnimationFrame(animRef.current)
  }, [isDark])

  return (
    <div ref={containerRef} style={{ position: "relative", width: 340, height: 340, flexShrink: 0 }}>
      <motion.div style={{ scale, x, opacity, position: "relative", width: "100%", height: "100%" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block" }}
        />
        {/* Score overlay */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          {/* Score number — always bright white with shadow for contrast on both sphere colors */}
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 64, fontWeight: 500,
            color: "#FFFFFF",
            lineHeight: 1,
            textShadow: isDark
              ? "0 0 32px rgba(212,180,122,0.9), 0 2px 12px rgba(0,0,0,0.8)"
              : "0 2px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.4)",
            letterSpacing: "-0.02em",
          }}>
            {score}
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, fontWeight: 500,
            color: isDark ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.9)",
            letterSpacing: "0.14em",
            marginTop: 8,
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}>
            EXCELLENT · Approved
          </div>
        </div>
      </motion.div>
    </div>
  )
}
