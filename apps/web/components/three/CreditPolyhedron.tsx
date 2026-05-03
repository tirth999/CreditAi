"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTheme } from "@/hooks/useTheme"
import { useMouseParallax } from "@/hooks/useMouseParallax"
import * as THREE from "three"

/**
 * Hero scene — Floating wireframe icosahedron
 * Slow Y rotation, breathing scale, mouse parallax tilt
 */
export function CreditPolyhedron() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { isDark } = useTheme()
  const mouse = useMouseParallax()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    // Slow Y rotation
    meshRef.current.rotation.y += 0.003

    // Breathing scale
    const breathe = Math.sin(t * 0.4) * 0.03 + 1
    meshRef.current.scale.setScalar(breathe)

    // Mouse parallax tilt (±15deg = ±0.26 rad)
    const targetX = mouse.current.y * 0.26
    const targetY = mouse.current.x * 0.26
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05
    // Don't override Y rotation, add parallax smoothly
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshStandardMaterial
        color={isDark ? "#FFFFFF" : "#000000"}
        wireframe={true}
        opacity={0.6}
        transparent
      />
    </mesh>
  )
}
