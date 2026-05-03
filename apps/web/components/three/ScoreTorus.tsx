"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTheme } from "@/hooks/useTheme"
import * as THREE from "three"

interface ScoreTorusProps {
  score?: number // 0-850
  animated?: boolean
  progress?: number // 0-1, controlled externally
}

/**
 * Score section — Hollow torus representing credit score arc
 * Arc angle derived from score percentage
 */
export function ScoreTorus({ score = 742, animated = false, progress = 1 }: ScoreTorusProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { isDark } = useTheme()

  // Score color thresholds
  const getScoreColor = (s: number, dark: boolean) => {
    if (dark) {
      if (s >= 800) return "#FFFFFF"
      if (s >= 650) return "#BBBBBB"
      if (s >= 550) return "#666666"
      return "#333333"
    } else {
      if (s >= 800) return "#000000"
      if (s >= 650) return "#444444"
      if (s >= 550) return "#999999"
      return "#CCCCCC"
    }
  }

  const color = getScoreColor(score, isDark)
  const maxArc = (score / 850) * Math.PI * 2

  // Create torus geometry with animated arc
  const geometry = useMemo(() => {
    const arcAngle = maxArc * progress
    return new THREE.TorusGeometry(1.5, 0.04, 16, 200, arcAngle)
  }, [maxArc, progress])

  // Background track (full circle, very dim)
  const trackGeometry = useMemo(() => {
    return new THREE.TorusGeometry(1.5, 0.02, 16, 200, Math.PI * 2)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = -Math.PI / 2 // Start from top
  })

  return (
    <group ref={groupRef}>
      {/* Track */}
      <mesh geometry={trackGeometry}>
        <meshBasicMaterial color={isDark ? "#222222" : "#E0E0D8"} />
      </mesh>
      {/* Score arc */}
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}
