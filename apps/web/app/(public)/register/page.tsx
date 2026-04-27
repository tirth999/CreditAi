import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RegisterForm from "@/components/forms/RegisterForm"

export const metadata = { title: "Create Account — CreditAI" }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <Card className="w-full max-w-md" style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20 }}>
        <CardHeader style={{ textAlign: "center", paddingBottom: 8 }}>
          <div style={{ fontFamily: "var(--font-palatino)", fontSize: 20, letterSpacing: "0.15em", color: "var(--accent-gold)", marginBottom: 8 }}>CREDITAI</div>
          <CardTitle style={{ fontFamily: "var(--font-palatino)", fontSize: 26, fontWeight: 300, color: `rgb(var(--text))` }}>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
