"use client"

import { useEffect, useState } from "react"

interface Props {
  score: number
  size?: number
}

function scoreColor(s: number) {
  if (s >= 740) return "#22c55e"
  if (s >= 670) return "#14b8a6"
  if (s >= 580) return "#d4a84b"
  return "#ef4444"
}

function gradeLabel(s: number) {
  if (s >= 800) return "Exceptional"
  if (s >= 740) return "Very Good"
  if (s >= 670) return "Good"
  if (s >= 580) return "Fair"
  return "Poor"
}

export default function ScoreGauge({ score, size = 240 }: Props) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const progress = Math.max(0, Math.min((score - 300) / 550, 1))
  const color = scoreColor(score)
  const strokeWidth = size * 0.06
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - animatedProgress)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-palatino, 'Palatino Linotype', Georgia, serif)",
            fontSize: size * 0.22,
            fontWeight: 300,
            color: color,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted, rgba(255,255,255,0.5))",
            marginTop: 6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {gradeLabel(score)}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted, rgba(255,255,255,0.35))",
            marginTop: 4,
            fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          }}
        >
          300 — 850
        </div>
      </div>
    </div>
  )
}
