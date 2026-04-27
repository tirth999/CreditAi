"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { loginSchema, type LoginFormData } from "@/lib/validations"

export default function LoginForm() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const res = await signIn("credentials", { ...data, redirect: false })
    if (res?.error) {
      toast.error("Invalid email or password")
    } else {
      toast.success("Welcome back!")
      router.push("/dashboard")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <Label htmlFor="email" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10 }}
        />
        {errors.email && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Password</Label>
        <div style={{ position: "relative" }}>
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10, paddingRight: 44 }}
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, lineHeight: 1 }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}
        style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", borderRadius: 10, fontWeight: 600, height: 44, fontSize: 15, marginTop: 4 }}>
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
      </Button>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
        Don&apos;t have an account?{" "}
        <a href="/register" style={{ color: "var(--accent-gold)", textDecoration: "none" }}>Create one →</a>
      </p>
    </form>
  )
}
