import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"

export const metadata: Metadata = {
  title: "CreditAI — Your Credit. Decoded.",
  description:
    "AI-powered credit intelligence platform. Real-time score monitoring, AI dispute generation, and personalized action plans.",
  openGraph: {
    title: "CreditAI — Your Credit. Decoded.",
    description: "AI-powered credit analysis. Know your score, fix your future.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        suppressHydrationWarning
        style={{
          background: "var(--bg-void)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
