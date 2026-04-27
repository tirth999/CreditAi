import PublicNavbar from "@/components/home/PublicNavbar"
import HeroSection from "@/components/home/HeroSection"
import StatsBar from "@/components/home/StatsBar"
import WaveTimeline from "@/components/home/WaveTimeline"
import FeaturesGrid from "@/components/home/FeaturesGrid"
import ComparisonTable from "@/components/home/ComparisonTable"
import ResearchSection from "@/components/home/ResearchSection"
import HomeFooter from "@/components/home/HomeFooter"

export const metadata = {
  title: "CreditAI — Intelligent Credit Risk Platform",
  description: "AI credit scoring with fairness, XAI, and drift detection. Built on 7 peer-reviewed papers.",
}

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <PublicNavbar />
      <HeroSection />
      <StatsBar />
      <WaveTimeline />
      <FeaturesGrid />
      <ComparisonTable />
      <ResearchSection />
      <HomeFooter />
    </main>
  )
}
