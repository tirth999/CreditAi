import dynamic from "next/dynamic"
import PublicNavbar from "@/components/home/PublicNavbar"
import HeroSection from "@/components/home/HeroSection"
import StatsSection from "@/components/home/StatsSection"
import FeaturesGrid from "@/components/home/FeaturesGrid"
import HowItWorks from "@/components/home/HowItWorks"
import ResearchSection from "@/components/home/ResearchSection"
import CTASection from "@/components/home/CTASection"
import HomeFooter from "@/components/home/HomeFooter"

export const metadata = {
  title: "CreditAI — Predict Risk. Build Trust. Lend Smarter.",
  description: "AI-powered credit risk scoring with explainability, fairness auditing, and drift detection. Built on 7 peer-reviewed research papers.",
}

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg-primary)" }}>
      <PublicNavbar />
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />
      <HowItWorks />
      <ResearchSection />
      <CTASection />
      <HomeFooter />
    </main>
  )
}
