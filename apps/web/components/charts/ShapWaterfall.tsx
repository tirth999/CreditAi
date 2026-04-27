"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"

interface ShapValue {
  feature_name: string
  shap_value: number
  feature_value: number | null
  direction: string
}

interface Props {
  shapValues: ShapValue[]
}

function fmtFeature(n: string) {
  return n.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

export default function ShapWaterfall({ shapValues }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!shapValues?.length) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const sorted = [...shapValues].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    const margin = { top: 10, right: 60, bottom: 30, left: 140 }
    const barH = 28
    const gap = 6
    const w = 480
    const h = margin.top + margin.bottom + sorted.length * (barH + gap)

    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%").attr("height", h)

    const maxAbs = d3.max(sorted, d => Math.abs(d.shap_value)) || 0.1
    const xScale = d3.scaleLinear().domain([-maxAbs, maxAbs]).range([margin.left, w - margin.right])
    const center = xScale(0)

    const g = svg.append("g")

    g.append("line")
      .attr("x1", center).attr("x2", center)
      .attr("y1", margin.top).attr("y2", h - margin.bottom)
      .attr("stroke", "rgba(255,255,255,0.1)").attr("stroke-width", 1)

    const tooltip = d3.select("body").append("div")
      .style("position", "absolute").style("pointer-events", "none")
      .style("background", "rgba(10,15,30,0.95)").style("border", "1px solid rgba(212,168,75,0.3)")
      .style("border-radius", "8px").style("padding", "8px 12px").style("font-size", "12px")
      .style("color", "#f5f0e8").style("opacity", "0").style("z-index", "9999")

    sorted.forEach((d, i) => {
      const y = margin.top + i * (barH + gap)
      const positive = d.shap_value > 0
      const barStart = positive ? center : xScale(d.shap_value)
      const barEnd = positive ? xScale(d.shap_value) : center
      const barWidth = Math.max(barEnd - barStart, 2)
      const color = positive ? "#14b8a6" : "#ef4444"

      g.append("rect")
        .attr("x", barStart).attr("y", y)
        .attr("width", 0).attr("height", barH)
        .attr("rx", 4).attr("fill", color).attr("opacity", 0.85)
        .on("mouseenter", (event) => {
          tooltip.style("opacity", "1")
            .html(`<strong>${fmtFeature(d.feature_name)}</strong><br/>Value: ${d.feature_value ?? "N/A"}<br/>SHAP: ${d.shap_value > 0 ? "+" : ""}${d.shap_value.toFixed(4)}`)
            .style("left", `${event.pageX + 12}px`).style("top", `${event.pageY - 10}px`)
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.pageX + 12}px`).style("top", `${event.pageY - 10}px`)
        })
        .on("mouseleave", () => tooltip.style("opacity", "0"))
        .transition().duration(600).delay(i * 80)
        .attr("width", barWidth)

      g.append("text")
        .attr("x", margin.left - 8).attr("y", y + barH / 2 + 4)
        .attr("text-anchor", "end").attr("fill", "var(--text-muted)")
        .attr("font-size", 11).text(fmtFeature(d.feature_name))

      g.append("text")
        .attr("x", positive ? barEnd + 6 : barStart - 6)
        .attr("y", y + barH / 2 + 4)
        .attr("text-anchor", positive ? "start" : "end")
        .attr("fill", color).attr("font-size", 11).attr("font-weight", 600)
        .text(`${positive ? "+" : ""}${d.shap_value.toFixed(3)}`)
    })

    return () => { tooltip.remove() }
  }, [shapValues])

  return <svg ref={svgRef} style={{ width: "100%", overflow: "visible" }} />
}
