"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard, BarChart3, Sparkles, Scale,
  Activity, Database, FilePlus, Settings, Shield,
  Menu, X, LogOut, Bell,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Score History", href: "/dashboard/score-history", icon: BarChart3 },
  { label: "XAI Explorer", href: "/dashboard/xai-explorer", icon: Sparkles },
  { label: "Fairness Audit", href: "/dashboard/fairness", icon: Scale },
  { label: "Drift Monitor", href: "/dashboard/drift", icon: Activity },
  { label: "Model Registry", href: "/dashboard/models", icon: Database },
  { label: "New Application", href: "/dashboard/new-application", icon: FilePlus },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

const ADMIN_NAV = [{ label: "Admin", href: "/dashboard/admin", icon: Shield }]

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

interface Props {
  role: string
  user: { id?: string; name?: string | null; email?: string | null; role?: string }
  children: React.ReactNode
}

export function DashboardShellWrapper({ role, user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] || "Dashboard"

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div
      className="dashboard-shell"
      style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-void)" }}
    >
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          width: 220,
          flexShrink: 0,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/"
            style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.05em", color: "var(--text-primary)", textDecoration: "none" }}
          >
            CREDITAI
          </Link>
          {/* Close button for mobile */}
          <button
            className="mobile-menu-btn"
            onClick={closeSidebar}
            aria-label="Close menu"
            style={{ border: "none" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", padding: "8px 20px 6px" }}>
            Platform
          </div>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
                  fontSize: 14, fontFamily: "var(--font-body)", fontWeight: active ? 500 : 400,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  textDecoration: "none", background: active ? "var(--bg-hover)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                  transition: "color 0.12s ease, background 0.12s ease",
                }}
              >
                <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                <span>{label}</span>
              </Link>
            )
          })}

          {role === "admin" && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", padding: "16px 20px 6px" }}>
                Admin
              </div>
              {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeSidebar}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
                      fontSize: 14, fontFamily: "var(--font-body)", fontWeight: active ? 500 : 400,
                      color: active ? "var(--text-primary)" : "var(--text-secondary)",
                      textDecoration: "none", background: active ? "var(--bg-hover)" : "transparent",
                      borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    }}
                  >
                    <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        {/* Bottom user */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--accent)", color: "var(--bg-void)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>
            TI
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>Tirth I.</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>RESEARCHER</div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header
          className="dashboard-topbar"
          style={{
            height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px", background: "var(--bg-void)", borderBottom: "1px solid var(--border)", flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Hamburger (hidden on desktop via CSS) */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h1 style={{ fontFamily: "var(--font-editorial)", fontSize: 20, fontStyle: "italic", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              {pageTitle}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ThemeToggle />
            <button
              style={{ background: "none", border: "1px solid var(--border)", borderRadius: 0, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}
              aria-label="Notifications"
            >
              <Bell size={14} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="topbar-user-name" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>
                {user.name || user.email || "User"}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 0, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main" style={{ flex: 1, overflowY: "auto", padding: 24, background: "var(--bg-void)" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
