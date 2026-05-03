"use client"

import { useEffect, useRef, useState } from "react"

interface FloatingObj {
  id: number
  x: number
  y: number
  size: number
  shape: "icosahedron" | "octahedron" | "torus" | "ring" | "diamond"
  color: string
  rotSpeed: number
  floatSpeed: number
  floatAmp: number
  opacity: number
  delay: number
}

const OBJECTS: FloatingObj[] = [
  { id: 1, x: 8, y: 15, size: 120, shape: "icosahedron", color: "#c9a84c", rotSpeed: 0.3, floatSpeed: 4, floatAmp: 20, opacity: 0.2, delay: 0 },
  { id: 2, x: 85, y: 25, size: 80, shape: "torus", color: "#7eb8d4", rotSpeed: 0.5, floatSpeed: 5, floatAmp: 15, opacity: 0.15, delay: 1 },
  { id: 3, x: 75, y: 60, size: 60, shape: "octahedron", color: "#8b5cf6", rotSpeed: 0.4, floatSpeed: 6, floatAmp: 18, opacity: 0.18, delay: 0.5 },
  { id: 4, x: 12, y: 70, size: 50, shape: "diamond", color: "#6ee7b7", rotSpeed: 0.6, floatSpeed: 3.5, floatAmp: 12, opacity: 0.12, delay: 2 },
  { id: 5, x: 92, y: 80, size: 90, shape: "icosahedron", color: "#f59e0b", rotSpeed: 0.25, floatSpeed: 7, floatAmp: 22, opacity: 0.1, delay: 1.5 },
  { id: 6, x: 50, y: 45, size: 180, shape: "ring", color: "#c9a84c", rotSpeed: 0.15, floatSpeed: 8, floatAmp: 10, opacity: 0.06, delay: 0 },
  { id: 7, x: 30, y: 85, size: 45, shape: "octahedron", color: "#f472b6", rotSpeed: 0.7, floatSpeed: 4.5, floatAmp: 16, opacity: 0.14, delay: 3 },
  { id: 8, x: 65, y: 10, size: 55, shape: "diamond", color: "#7eb8d4", rotSpeed: 0.35, floatSpeed: 5.5, floatAmp: 14, opacity: 0.12, delay: 2.5 },
]

function Shape3D({ obj, scrollY }: { obj: FloatingObj; scrollY: number }) {
  const parallax = scrollY * (0.05 + obj.size * 0.001)

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${obj.x}%`,
    top: `${obj.y}%`,
    width: obj.size,
    height: obj.size,
    transform: `translateY(${-parallax}px)`,
    pointerEvents: "none",
    zIndex: 0,
  }

  const innerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    animation: `float3d-${obj.id} ${obj.floatSpeed}s ease-in-out infinite, spin3d-${obj.id} ${20 / obj.rotSpeed}s linear infinite`,
    animationDelay: `${obj.delay}s`,
  }

  const shapeContent = () => {
    switch (obj.shape) {
      case "icosahedron":
        return (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: obj.opacity }}>
            <polygon points="50,5 95,35 80,90 20,90 5,35" fill="none" stroke={obj.color} strokeWidth="1" />
            <polygon points="50,5 80,90 20,90" fill="none" stroke={obj.color} strokeWidth="0.5" opacity={0.5} />
            <polygon points="95,35 80,90 50,5" fill="none" stroke={obj.color} strokeWidth="0.5" opacity={0.5} />
            <polygon points="5,35 20,90 50,5" fill="none" stroke={obj.color} strokeWidth="0.5" opacity={0.5} />
            <polygon points="50,5 95,35 5,35" fill={`${obj.color}08`} stroke="none" />
          </svg>
        )
      case "octahedron":
        return (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: obj.opacity }}>
            <polygon points="50,5 95,50 50,95 5,50" fill={`${obj.color}06`} stroke={obj.color} strokeWidth="1" />
            <line x1="50" y1="5" x2="50" y2="95" stroke={obj.color} strokeWidth="0.5" opacity={0.4} />
            <line x1="5" y1="50" x2="95" y2="50" stroke={obj.color} strokeWidth="0.5" opacity={0.4} />
          </svg>
        )
      case "torus":
        return (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: obj.opacity }}>
            <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke={obj.color} strokeWidth="1" />
            <ellipse cx="50" cy="50" rx="30" ry="13" fill="none" stroke={obj.color} strokeWidth="0.5" opacity={0.5} />
            <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke={obj.color} strokeWidth="0.3" opacity={0.3} transform="rotate(60, 50, 50)" />
          </svg>
        )
      case "ring":
        return (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: obj.opacity }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke={obj.color} strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="50" cy="50" r="35" fill="none" stroke={obj.color} strokeWidth="0.3" strokeDasharray="2 8" />
            <circle cx="50" cy="50" r="25" fill="none" stroke={obj.color} strokeWidth="0.2" strokeDasharray="1 10" />
          </svg>
        )
      case "diamond":
        return (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: obj.opacity }}>
            <polygon points="50,5 75,35 95,50 75,65 50,95 25,65 5,50 25,35" fill={`${obj.color}05`} stroke={obj.color} strokeWidth="1" />
            <polygon points="50,5 75,35 50,50 25,35" fill={`${obj.color}08`} stroke={obj.color} strokeWidth="0.3" />
            <line x1="50" y1="5" x2="50" y2="95" stroke={obj.color} strokeWidth="0.3" opacity={0.3} />
          </svg>
        )
    }
  }

  return (
    <div style={style}>
      <div style={innerStyle}>
        {shapeContent()}
      </div>
      <style>{`
        @keyframes float3d-${obj.id} {
          0%, 100% { transform: translateY(0) rotate3d(1, 0.5, 0, 0deg); }
          50% { transform: translateY(${-obj.floatAmp}px) rotate3d(1, 0.5, 0, 8deg); }
        }
        @keyframes spin3d-${obj.id} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Particle field
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 3
    }
    resize()
    window.addEventListener("resize", resize)

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
      })
    }

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6 }} />
}

export default function FloatingScene() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <Particles />
      {OBJECTS.map(obj => (
        <Shape3D key={obj.id} obj={obj} scrollY={scrollY} />
      ))}
    </div>
  )
}
