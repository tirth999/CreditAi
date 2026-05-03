"use client"

import dynamic from "next/dynamic"
import { useLenis } from "@/hooks/useLenis"

// Dynamic imports to prevent SSR issues with Three.js/GSAP
const Hero = dynamic(() => import("@/components/landing/Hero"), { ssr: false })
const ScoreSection = dynamic(() => import("@/components/landing/ScoreSection"), { ssr: false })
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), { ssr: false })
const FeaturesGrid = dynamic(() => import("@/components/landing/FeaturesGrid"), { ssr: false })
const StatsBanner = dynamic(() => import("@/components/landing/StatsBanner"), { ssr: false })
const CTABanner = dynamic(() => import("@/components/landing/CTABanner"), { ssr: false })
const Footer = dynamic(() => import("@/components/landing/Footer"), { ssr: false })

export default function LandingPage() {
  useLenis()

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
