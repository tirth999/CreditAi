import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"

export const metadata: Metadata = {
  title: "CreditAI — Intelligent Credit Risk Platform",
  description:
    "AI-powered credit scoring with fairness, explainability, and drift detection. Built for the future of ethical finance.",
  openGraph: {
    title: "CreditAI — Intelligent Credit Risk Platform",
    description: "Neural credit scoring with XAI, fairness monitoring, and real-time drift detection.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className="antialiased font-sans"
        style={{ background: "var(--bg-primary)", color: `rgb(var(--text))` }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
