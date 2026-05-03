"use client"

import { useEffect, useRef } from "react"

interface ParticleCloudProps {
  width?: number
  height?: number
}

export default function ParticleCloud({ width = 500, height = 400 }: ParticleCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const hoverRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    const COUNT = 3000
    const cx = width / 2, cy = height / 2
    const R = Math.min(width, height) * 0.4

    // Sphere distribution
    const points: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = []
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = R * (0.5 + Math.random() * 0.5)
      points.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.sin(phi) * Math.sin(theta) * r,
        z: Math.cos(phi) * r,
        ox: 0, oy: 0, oz: 0,
      })
      points[i].ox = points[i].x
      points[i].oy = points[i].y
      points[i].oz = points[i].z
    }

    let rotY = 0, rotX = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      const speed = hoverRef.current ? 0.006 : 0.001
      rotY += speed
      rotX += speed * 0.5

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)

      const isDark = document.documentElement.getAttribute("data-theme") === "dark"
      const color = isDark ? "212,180,122" : "26,26,46"

      points.forEach(p => {
        // Rotate Y
        const x1 = p.ox * cosY - p.oz * sinY
        const z1 = p.ox * sinY + p.oz * cosY
        // Rotate X
        const y2 = p.oy * cosX - z1 * sinX
        const z2 = p.oy * sinX + z1 * cosX

        const perspective = 600 / (600 + z2)
        const sx = cx + x1 * perspective
        const sy = cy + y2 * perspective
        const size = Math.max(0.3, 1.5 * perspective)
        const alpha = Math.min(0.7, 0.3 + 0.4 * perspective) * 0.6

        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) draw()
      else cancelAnimationFrame(animRef.current)
    }, { threshold: 0.2 })
    obs.observe(canvas)

    canvas.addEventListener("mouseenter", () => { hoverRef.current = true })
    canvas.addEventListener("mouseleave", () => { hoverRef.current = false })

    return () => {
      obs.disconnect()
      cancelAnimationFrame(animRef.current)
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: "block", cursor: "crosshair" }}
    />
  )
}
