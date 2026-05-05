"use client"

import { useEffect, useRef } from "react"

interface NeuralNetProps {
  width?: number
  height?: number
}

const LAYERS = [
  { count: 6, color: "#999999", label: "Input" },
  { count: 8, color: "#FFFFFF", label: "Hidden" },
  { count: 2, color: null, label: "Output" },
]

export default function NeuralNetwork({ width = 500, height = 320 }: NeuralNetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const visibleRef = useRef(false)
  const progressRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = width * 2
    canvas.height = height * 2
    ctx.scale(2, 2)


    const nodes: { x: number; y: number; color: string; scale: number; phase: number }[] = []
    const edges: { from: number; to: number; signal: number; active: boolean }[] = []

    LAYERS.forEach((layer, li) => {
      const x = (width / (LAYERS.length + 1)) * (li + 1)
      for (let ni = 0; ni < layer.count; ni++) {
        const y = (height / (layer.count + 1)) * (ni + 1)
        const color = layer.color ?? (ni === 0 ? "#CCCCCC" : "#888888")
        nodes.push({ x, y, color, scale: 0, phase: li * 0.4 + ni * 0.15 })
      }
    })


    let offset = 0
    LAYERS.forEach((layer, li) => {
      if (li < LAYERS.length - 1) {
        const nextLayer = LAYERS[li + 1]
        for (let a = 0; a < layer.count; a++) {
          for (let b = 0; b < nextLayer.count; b++) {
            edges.push({ from: offset + a, to: offset + layer.count + b, signal: Math.random(), active: false })
          }
        }
      }
      offset += layer.count
    })

    let time = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      const p = progressRef.current


      edges.forEach(edge => {
        const from = nodes[edge.from]
        const to = nodes[edge.to]
        const edgeProgress = Math.min(p * 3, 1)
        if (edgeProgress <= 0) return
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(180,180,180,${0.25 * edgeProgress})`
        ctx.lineWidth = 0.6
        ctx.stroke()


        const sig = (time * 0.6 + edge.signal) % 1
        if (edgeProgress > 0.5) {
          const sx = from.x + (to.x - from.x) * sig
          const sy = from.y + (to.y - from.y) * sig
          ctx.beginPath()
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${0.6 * edgeProgress})`
          ctx.fill()
        }
      })


      nodes.forEach((node, i) => {
        const nodeProgress = Math.min(Math.max((p - node.phase * 0.15) * 3, 0), 1)
        node.scale = nodeProgress

        if (nodeProgress <= 0) return

        const pulse = 1 + Math.sin(time * 2 + node.phase * 4) * 0.08 * nodeProgress
        const r = 10 * pulse * node.scale


        const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5)
        grd.addColorStop(0, node.color + "40")
        grd.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()


        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
        ctx.strokeStyle = "rgba(255,255,255,0.25)"
        ctx.lineWidth = 0.8
        ctx.stroke()
      })

      time += 0.012
      if (progressRef.current < 1) progressRef.current = Math.min(progressRef.current + 0.008, 1)
      animRef.current = requestAnimationFrame(draw)
    }


    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        progressRef.current = 0
        visibleRef.current = true
        draw()
      }
    }, { threshold: 0.3 })
    obs.observe(canvas)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(animRef.current)
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: "block" }}
    />
  )
}
