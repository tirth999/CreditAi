"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"

interface DataPoint {
  application_id: string
  feature_value: number
  shap_value: number
}

interface Props {
  data: DataPoint[]
  feature: string
}

export default function ShapBeeswarm({ data, feature }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data?.length) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 30, right: 30, bottom: 40, left: 60 }
    const w = 600
    const h = 300

    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%").attr("height", h)

    const xExtent = d3.extent(data, d => d.shap_value) as [number, number]
    const xScale = d3.scaleLinear().domain([xExtent[0] * 1.1, xExtent[1] * 1.1]).range([margin.left, w - margin.right])
    const fExtent = d3.extent(data, d => d.feature_value) as [number, number]
    const colorScale = d3.scaleLinear<string>().domain([fExtent[0], fExtent[1]]).range(["#ef4444", "#14b8a6"])
    const cy = h / 2

    const g = svg.append("g")

    g.append("g").attr("transform", `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .call(g => g.selectAll("text").attr("fill", "var(--text-muted)").attr("font-size", 10))
      .call(g => g.selectAll("line, path").attr("stroke", "rgba(255,255,255,0.1)"))

    g.append("text").attr("x", w / 2).attr("y", h - 4)
      .attr("text-anchor", "middle").attr("fill", "var(--text-muted)").attr("font-size", 11)
      .text("SHAP Value")

    g.append("line").attr("x1", xScale(0)).attr("x2", xScale(0))
      .attr("y1", margin.top).attr("y2", h - margin.bottom)
      .attr("stroke", "rgba(255,255,255,0.15)").attr("stroke-dasharray", "4,4")

    const tooltip = d3.select("body").append("div")
      .style("position", "absolute").style("pointer-events", "none")
      .style("background", "rgba(10,15,30,0.95)").style("border", "1px solid rgba(212,168,75,0.3)")
      .style("border-radius", "8px").style("padding", "8px 12px").style("font-size", "12px")
      .style("color", "#f5f0e8").style("opacity", "0").style("z-index", "9999")

    const simulation = d3.forceSimulation(data.map((d, i) => ({ ...d, index: i, x: xScale(d.shap_value), y: cy })))
      .force("x", d3.forceX<any>(d => xScale(d.shap_value)).strength(1))
      .force("y", d3.forceY(cy).strength(0.1))
      .force("collide", d3.forceCollide(4))
      .stop()

    for (let i = 0; i < 120; i++) simulation.tick()

    const nodes = simulation.nodes() as any[]

    g.selectAll("circle").data(nodes).join("circle")
      .attr("cx", (d: any) => d.x).attr("cy", (d: any) => Math.max(margin.top + 5, Math.min(h - margin.bottom - 5, d.y)))
      .attr("r", 3.5).attr("fill", (d: any) => colorScale(d.feature_value))
      .attr("opacity", 0.8).attr("stroke", "rgba(0,0,0,0.3)").attr("stroke-width", 0.5)
      .on("mouseenter", (event: any, d: any) => {
        tooltip.style("opacity", "1")
          .html(`<strong>ID:</strong> ${d.application_id}<br/><strong>${feature}:</strong> ${d.feature_value}<br/><strong>SHAP:</strong> ${d.shap_value.toFixed(4)}`)
          .style("left", `${event.pageX + 12}px`).style("top", `${event.pageY - 10}px`)
      })
      .on("mousemove", (event: any) => {
        tooltip.style("left", `${event.pageX + 12}px`).style("top", `${event.pageY - 10}px`)
      })
      .on("mouseleave", () => tooltip.style("opacity", "0"))

    return () => { tooltip.remove() }
  }, [data, feature])

  return <svg ref={svgRef} style={{ width: "100%", overflow: "visible" }} />
}
