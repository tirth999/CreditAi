"use client"

import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { LogOut, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface Props {
  user: { id?: string; name?: string | null; email?: string | null; role?: string }
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/score-history": "Score History",
  "/dashboard/xai-explorer": "XAI Explorer",
  "/dashboard/fairness": "Fairness Audit",
  "/dashboard/drift": "Drift Monitor",
  "/dashboard/models": "Model Registry",
  "/dashboard/new-application": "New Application",
  "/dashboard/settings": "Settings",
  "/dashboard/admin": "Administration",
}

export function DashboardTopbar({ user }: Props) {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] || "Dashboard"

  return (
    <header
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "var(--bg-void)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      {/* Left: Page title */}
      <h1
        style={{
          fontFamily: "var(--font-editorial)",
          fontSize: 20,
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {pageTitle}
      </h1>

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notification bell */}
        <button
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 0,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-secondary)",
            transition: "border-color 0.12s ease, color 0.12s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-lit)"
            e.currentTarget.style.color = "var(--text-primary)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)"
            e.currentTarget.style.color = "var(--text-secondary)"
          }}
          aria-label="Notifications"
        >
          <Bell size={14} />
        </button>

        {/* User + sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            {user.name || user.email || "User"}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 0,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "border-color 0.12s ease, color 0.12s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--error)"
              e.currentTarget.style.color = "var(--error)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)"
              e.currentTarget.style.color = "var(--text-secondary)"
            }}
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
