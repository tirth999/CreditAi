"use client"

import { useEffect, useRef } from "react"

interface RiskGaugeRingProps {
  value: number   // 0–100
  size?: number
  label?: string
}

function getColor(value: number): string {
  if (value <= 40) return "#2A6648"
  if (value <= 70) return "#C8A96E"
  return "#A63228"
}

export default function RiskGaugeRing({ value, size = 200, label }: RiskGaugeRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = size * 2
    canvas.height = size * 2
    ctx.scale(2, 2)

    const cx = size / 2
    const cy = size / 2
    const r = size * 0.38
    const thickness = size * 0.075
    const startAngle = Math.PI * 0.75
    const totalAngle = Math.PI * 1.5
    const targetAngle = (value / 100) * totalAngle
    const color = getColor(value)

    let currentAngle = 0
    const duration = 1200
    const startTime = performance.now()

    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3) }

    function draw(now: number) {
      if (!ctx) return
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      currentAngle = easeOut(t) * targetAngle

      ctx.clearRect(0, 0, size, size)

      // Background ring
      ctx.beginPath()
      ctx.arc(cx, cy, r, startAngle, startAngle + totalAngle)
      ctx.strokeStyle = "#E0DDD6"
      ctx.lineWidth = thickness
      ctx.lineCap = "round"
      ctx.stroke()

      // Dark mode check
      const isDark = document.documentElement.getAttribute("data-theme") === "dark"
      if (isDark) ctx.strokeStyle = "#2A2A38"
      ctx.beginPath()
      ctx.arc(cx, cy, r, startAngle, startAngle + totalAngle)
      ctx.strokeStyle = isDark ? "#2A2A38" : "#E0DDD6"
      ctx.lineWidth = thickness
      ctx.stroke()

      // Value arc
      if (currentAngle > 0) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, startAngle, startAngle + currentAngle)
        ctx.strokeStyle = color
        ctx.lineWidth = thickness
        ctx.lineCap = "round"
        ctx.stroke()
      }

      // Center text
      const displayValue = Math.round(easeOut(t) * value)
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = `500 ${size * 0.2}px 'IBM Plex Mono', monospace`
      ctx.fillStyle = isDark ? "#E8E6E0" : "#1A1A2E"
      ctx.fillText(`${displayValue}%`, cx, cy - size * 0.04)

      if (label) {
        ctx.font = `400 ${size * 0.08}px 'DM Sans', sans-serif`
        ctx.fillStyle = isDark ? "#9B9890" : "#6B6860"
        ctx.fillText(label, cx, cy + size * 0.14)
      }

      if (t < 1) animRef.current = requestAnimationFrame(draw)
    }

    // Trigger on visibility
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) requestAnimationFrame(draw)
    }, { threshold: 0.4 })
    obs.observe(canvas)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(animRef.current)
    }
  }, [value, size, label])

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block" }} />
}
