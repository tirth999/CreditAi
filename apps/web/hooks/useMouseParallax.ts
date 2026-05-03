"use client"

import { useEffect, useRef, useCallback } from "react"

interface MousePosition {
  x: number // -1 to 1
  y: number // -1 to 1
}

/**
 * Track mouse position normalized to [-1, 1] range.
 * Throttled via requestAnimationFrame.
 */
export function useMouseParallax() {
  const position = useRef<MousePosition>({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafId.current !== null) return

    rafId.current = requestAnimationFrame(() => {
      position.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
      rafId.current = null
    })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [handleMouseMove])

  return position
}
