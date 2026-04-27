"use client"

import ApplicationForm from "@/components/forms/ApplicationForm"

export default function NewApplicationPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 8 }}>New Credit Application</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 32 }}>Submit your financial data for AI-powered credit scoring with full explainability.</p>
      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32 }}>
        <ApplicationForm />
      </div>
    </div>
  )
}
