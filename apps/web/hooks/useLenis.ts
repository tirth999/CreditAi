"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Initialize Lenis smooth scroll, synced with GSAP ScrollTrigger.
 * Disabled on touch devices.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Disable on touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Sync with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
