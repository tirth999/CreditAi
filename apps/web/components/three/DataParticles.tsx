"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTheme } from "@/hooks/useTheme"
import * as THREE from "three"

/**
 * Feature section — Floating data particles
 * ~200 points in spiral orbit, explode/collapse on visibility
 */
export function DataParticles({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { isDark } = useTheme()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const primaryColor = new THREE.Color(isDark ? "#FFFFFF" : "#0A0A0A")
    const tertiaryColor = new THREE.Color(isDark ? "#444444" : "#AAAAAA")

    for (let i = 0; i < count; i++) {
      // Spiral distribution
      const angle = (i / count) * Math.PI * 8
      const radius = 0.5 + (i / count) * 2
      const height = (Math.random() - 0.5) * 2

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = height
      pos[i * 3 + 2] = Math.sin(angle) * radius

      // Most points are tertiary, few are primary
      const usePrimary = Math.random() > 0.85
      const c = usePrimary ? primaryColor : tertiaryColor
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count, isDark])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    pointsRef.current.rotation.y = t * 0.1
    pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}
