"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"

interface Props {
  score: number
  size?: number
}

function gradeLabel(s: number) {
  if (s >= 800) return "Exceptional"
  if (s >= 740) return "Very Good"
  if (s >= 670) return "Good"
  if (s >= 580) return "Fair"
  return "Poor"
}

function scoreColor(s: number) {
  if (s >= 740) return "#22c55e"
  if (s >= 670) return "#14b8a6"
  if (s >= 580) return "#d4a84b"
  return "#ef4444"
}

const ZONES = [
  { min: 300, max: 580, color: "#ef4444" },
  { min: 580, max: 670, color: "#d4a84b" },
  { min: 670, max: 740, color: "#14b8a6" },
  { min: 740, max: 850, color: "#22c55e" },
]

export default function ScoreGauge({ score, size = 240 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const w = size
    const h = size * 0.7
    const cx = w / 2
    const cy = h * 0.85
    const r = Math.min(cx, cy) * 0.75
    const stroke = Math.max(r * 0.12, 8)
    const startAngle = -Math.PI
    const endAngle = 0

    const g = svg.append("g").attr("transform", `translate(${cx},${cy})`)

    const arc = d3.arc<{ startAngle: number; endAngle: number }>()
      .innerRadius(r - stroke / 2)
      .outerRadius(r + stroke / 2)
      .cornerRadius(stroke / 2)

    ZONES.forEach(zone => {
      const zs = startAngle + ((zone.min - 300) / 550) * Math.PI
      const ze = startAngle + ((zone.max - 300) / 550) * Math.PI
      g.append("path")
        .attr("d", arc({ startAngle: zs, endAngle: ze })!)
        .attr("fill", zone.color)
        .attr("opacity", 0.2)
    })

    const needleG = g.append("g")
    const needleLen = r * 0.72
    const needleAngle = startAngle + ((score - 300) / 550) * Math.PI

    needleG.append("line")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 0).attr("y2", -needleLen)
      .attr("stroke", scoreColor(score))
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round")

    needleG.append("circle").attr("r", 5).attr("fill", scoreColor(score))

    needleG.attr("transform", `rotate(${(startAngle * 180) / Math.PI})`)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("transform", `rotate(${(needleAngle * 180) / Math.PI})`)

    g.append("text")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .attr("fill", scoreColor(score))
      .attr("font-size", size * 0.18)
      .attr("font-family", "var(--font-palatino)")
      .text(score)

    g.append("text")
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-muted)")
      .attr("font-size", 12)
      .text(gradeLabel(score))

  }, [score, size])

  return <svg ref={svgRef} width={size} height={size * 0.7} />
}
