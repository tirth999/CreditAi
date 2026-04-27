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
import { registerSchema, type RegisterFormData } from "@/lib/validations"

export default function RegisterForm() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name: data.full_name, email: data.email, password: data.password }),
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail ?? "Registration failed")
      }
      const signInRes = await signIn("credentials", { email: data.email, password: data.password, redirect: false })
      if (signInRes?.error) throw new Error("Auto-login failed — please sign in manually")
      toast.success("Account created! Welcome to CreditAI.")
      router.push("/dashboard")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed")
    }
  }

  const field = (id: string, label: string, type = "text", placeholder = "") => (
    <div>
      <Label htmlFor={id} style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register(id as any)}
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10 }} />
      {(errors as any)[id] && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{(errors as any)[id]?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {field("full_name", "Full Name", "text", "John Smith")}
      {field("email", "Email", "email", "you@example.com")}

      <div>
        <Label htmlFor="password" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Password</Label>
        <div style={{ position: "relative" }}>
          <Input id="password" type={showPw ? "text" : "password"} placeholder="Min 8 characters" {...register("password")}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10, paddingRight: 44 }} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.password.message}</p>}
      </div>

      {field("confirmPassword", "Confirm Password", "password", "Repeat password")}

      <Button type="submit" disabled={isSubmitting}
        style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", borderRadius: 10, fontWeight: 600, height: 44, fontSize: 15, marginTop: 4 }}>
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Create Account"}
      </Button>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "var(--accent-gold)", textDecoration: "none" }}>Sign in →</a>
      </p>
    </form>
  )
}
