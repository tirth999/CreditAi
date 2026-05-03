"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Standard reveal animation: y:50, opacity:0 → natural position
 * Respects prefers-reduced-motion
 */
export function useReveal(selector: string = ".reveal-block") {
  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      // Show everything immediately
      document.querySelectorAll(selector).forEach((el) => {
        ;(el as HTMLElement).style.opacity = "1"
        ;(el as HTMLElement).style.transform = "none"
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
        })
      })
    })

    return () => ctx.revert()
  }, [selector])
}

/**
 * Pinned scroll section
 */
export function usePinnedSection(ref: React.RefObject<HTMLElement | null>, options?: { endOffset?: string }) {
  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: options?.endOffset || "+=100%",
      pin: true,
      pinSpacing: true,
    })

    return () => trigger.kill()
  }, [ref, options?.endOffset])
}

/**
 * Counter animation (0 → target)
 */
export function useCounterAnimation(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  duration: number = 2.0
) {
  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = String(target)
      return
    }

    const obj = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        val: target,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = String(Math.round(obj.val))
        },
      })
    })

    return () => ctx.revert()
  }, [ref, target, duration])
}

export { ScrollTrigger }
