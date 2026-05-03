"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "@/hooks/useTheme"
import { Html } from "@react-three/drei"
import * as THREE from "three"

interface BarData {
  label: string
  value: number
}

interface BarChart3DProps {
  data?: BarData[]
  maxValue?: number
  animated?: boolean
}

const DEFAULT_DATA: BarData[] = [
  { label: "Jan", value: 710 },
  { label: "Feb", value: 718 },
  { label: "Mar", value: 725 },
  { label: "Apr", value: 720 },
  { label: "May", value: 732 },
  { label: "Jun", value: 728 },
  { label: "Jul", value: 735 },
  { label: "Aug", value: 740 },
  { label: "Sep", value: 738 },
  { label: "Oct", value: 745 },
  { label: "Nov", value: 742 },
  { label: "Dec", value: 748 },
]

function Bar({
  position,
  height,
  color,
  label,
  value,
  index,
}: {
  position: [number, number, number]
  height: number
  color: string
  label: string
  value: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const targetScale = useRef(0)
  const currentScale = useRef(0)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    // Animate scale from 0 to 1 with stagger
    const delay = index * 0.05
    const progress = Math.min(1, Math.max(0, (t - delay) / 1.2))
    // expo.out approximation
    targetScale.current = 1 - Math.pow(2, -10 * progress)
    currentScale.current += (targetScale.current - currentScale.current) * 0.1

    const hoverMultiplier = hovered ? 1.08 : 1
    meshRef.current.scale.y = currentScale.current * hoverMultiplier
    meshRef.current.position.y = (height * currentScale.current * hoverMultiplier) / 2
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.3, height, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Label */}
      <Html position={[0, -0.2, 0]} center style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: "var(--text-tertiary)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          {label}
        </div>
      </Html>
      {/* Tooltip on hover */}
      {hovered && (
        <Html position={[0, height + 0.3, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "var(--text-primary)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              padding: "4px 8px",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {value}
          </div>
        </Html>
      )}
    </group>
  )
}

export function BarChart3D({ data = DEFAULT_DATA, maxValue = 850, animated = true }: BarChart3DProps) {
  const { isDark } = useTheme()
  const barColor = isDark ? "#FFFFFF" : "#000000"
  const gridColor = isDark ? "#444444" : "#AAAAAA"

  // Normalize heights (300-850 range → 0-3 visual height)
  const minScore = 300
  const normalizedData = data.map((d) => ({
    ...d,
    height: ((d.value - minScore) / (maxValue - minScore)) * 3,
  }))

  const totalWidth = data.length * 0.5
  const startX = -totalWidth / 2

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = []
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * 3
      lines.push([
        new THREE.Vector3(startX - 0.3, y, 0),
        new THREE.Vector3(startX + totalWidth + 0.3, y, 0),
      ])
    }
    return lines
  }, [startX, totalWidth])

  return (
    <group position={[0, -1.5, 0]}>
      {/* Grid lines */}
      {gridLines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={gridColor} opacity={0.3} transparent />
        </line>
      ))}

      {/* Bars */}
      {normalizedData.map((d, i) => (
        <Bar
          key={d.label}
          position={[startX + i * 0.5 + 0.25, 0, 0]}
          height={d.height}
          color={barColor}
          label={d.label}
          value={d.value}
          index={i}
        />
      ))}

      {/* Ambient + directional for depth */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
    </group>
  )
}
