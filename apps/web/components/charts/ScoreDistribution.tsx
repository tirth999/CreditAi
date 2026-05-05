"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ScoreDistributionProps {
  data?: Array<{ range: string; count: number; tier: string }>
}

const DEFAULT_DATA = [
  { range: "300–400", count: 42, tier: "Very Poor" },
  { range: "400–500", count: 87, tier: "Poor" },
  { range: "500–600", count: 156, tier: "Fair" },
  { range: "600–700", count: 312, tier: "Good" },
  { range: "700–750", count: 389, tier: "Very Good" },
  { range: "750–800", count: 198, tier: "Excellent" },
  { range: "800–850", count: 63, tier: "Exceptional" },
]

const TIER_COLORS: Record<string, { bar: string; glow: string }> = {
  "Very Poor": { bar: "#FF3B30", glow: "rgba(255,59,48,0.15)" },
  Poor: { bar: "#FF6B3D", glow: "rgba(255,107,61,0.15)" },
  Fair: { bar: "#FFB340", glow: "rgba(255,179,64,0.15)" },
  Good: { bar: "#34D399", glow: "rgba(52,211,153,0.15)" },
  "Very Good": { bar: "#14B8A6", glow: "rgba(20,184,166,0.15)" },
  Excellent: { bar: "#06B6D4", glow: "rgba(6,182,212,0.15)" },
  Exceptional: { bar: "#8B5CF6", glow: "rgba(139,92,246,0.15)" },
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-lit)",
        padding: "12px 16px",
        fontFamily: "var(--font-body)",
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginBottom: 8,
        }}
      >
        SCORE RANGE
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        {data.range}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {data.tier}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 700,
            color: TIER_COLORS[data.tier]?.bar || "var(--text-primary)",
          }}
        >
          {data.count} applicants
        </span>
      </div>
    </div>
  )
}

function CustomBar(props: any) {
  const { x, y, width, height, tier } = props
  const colors = TIER_COLORS[tier] || { bar: "#888", glow: "rgba(136,136,136,0.15)" }
  const radius = 4
  const id = `gradient-${tier.replace(/\s/g, "")}`

  if (height <= 0) return null

  return (
    <g>
      {/* Glow shadow */}
      <rect
        x={x + 2}
        y={y + 4}
        width={width - 4}
        height={height}
        rx={radius}
        ry={radius}
        fill={colors.glow}
        style={{ filter: "blur(8px)" }}
      />
      {/* Gradient definition */}
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bar} stopOpacity={1} />
          <stop offset="100%" stopColor={colors.bar} stopOpacity={0.5} />
        </linearGradient>
      </defs>
      {/* Main bar with rounded top */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={`url(#${id})`}
        style={{
          transition: "opacity 0.2s ease",
          cursor: "pointer",
        }}
      />
      {/* Top highlight line */}
      <rect
        x={x + 1}
        y={y}
        width={width - 2}
        height={1.5}
        rx={radius}
        fill={colors.bar}
        opacity={0.6}
      />
    </g>
  )
}

export default function ScoreDistribution({
  data = DEFAULT_DATA,
}: ScoreDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 16, bottom: 20, left: 16 }}
        barCategoryGap="18%"
      >
        {/* Grid */}
        <XAxis
          dataKey="range"
          tick={{
            fill: "var(--text-tertiary)",
            fontSize: 11,
            fontFamily: "'Space Mono', monospace",
          }}
          axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{
            fill: "var(--text-tertiary)",
            fontSize: 10,
            fontFamily: "'Space Mono', monospace",
          }}
          axisLine={false}
          tickLine={false}
          dx={-4}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            fill: "var(--bg-hover)",
            opacity: 0.5,
          }}
        />
        <Bar
          dataKey="count"
          shape={<CustomBar />}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier]?.bar || "#888"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
