"use client"

import { useEffect } from "react"
import { useLenis } from "@/hooks/useLenis"

import Hero from "@/components/landing/Hero"
import ScoreSection from "@/components/landing/ScoreSection"
import HowItWorks from "@/components/landing/HowItWorks"
import FeaturesGrid from "@/components/landing/FeaturesGrid"
import StatsBanner from "@/components/landing/StatsBanner"
import CTABanner from "@/components/landing/CTABanner"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  useLenis()

  useEffect(() => {
    if (typeof window !== "undefined" && window.history) {
      // Prevent browser from restoring previous scroll position on refresh
      window.history.scrollRestoration = "manual"
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <main style={{ background: "var(--bg-void)" }}>
      <Hero />
      <ScoreSection />
      <HowItWorks />
      <FeaturesGrid />
      <StatsBanner />
      <CTABanner />
      <Footer />
    </main>
  )
}
