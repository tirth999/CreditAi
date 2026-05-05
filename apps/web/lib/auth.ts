import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        // Try the real backend first
        try {
          const res = await fetch(
            `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsed.data),
            }
          )
          if (!res.ok) return null

          const data = await res.json()
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.full_name,
            role: data.user.role,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: Date.now() + 30 * 60 * 1000,
          }
        } catch {
          // Backend unreachable — fall back to demo credentials
          // This allows the frontend to work standalone for academic demos
          const DEMO_USERS: Record<string, { password: string; name: string; role: string }> = {
            "admin@creditai.dev": { password: "Admin123!", name: "Admin User", role: "admin" },
            "demo@creditai.dev": { password: "Demo123!", name: "Demo Researcher", role: "user" },
          }

          const demo = DEMO_USERS[parsed.data.email]
          if (demo && parsed.data.password === demo.password) {
            return {
              id: parsed.data.email === "admin@creditai.dev" ? "admin-001" : "demo-001",
              email: parsed.data.email,
              name: demo.name,
              role: demo.role,
              accessToken: "demo-token",
              refreshToken: "demo-refresh",
              accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            }
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: (user as any).role,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: (user as any).accessTokenExpires,
        }
      }
      if (Date.now() < (token.accessTokenExpires as number)) return token
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      ;(session as any).accessToken = token.accessToken
      ;(session as any).error = token.error
      return session
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
}

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
      }
    )
    const data = await res.json()
    if (!res.ok) throw data
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + 30 * 60 * 1000,
      error: undefined,
    }
  } catch {
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
