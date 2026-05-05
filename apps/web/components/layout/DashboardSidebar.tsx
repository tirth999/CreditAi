"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, BarChart3, Sparkles, Scale,
  Activity, Database, FilePlus, Settings, Shield,
} from "lucide-react"

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

interface Props {
  role: string
}

function SidebarLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string
  label: string
  Icon: React.ComponentType<any>
  active: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        borderRadius: 0,
        fontSize: 14,
        fontFamily: "var(--font-body)",
        fontWeight: active ? 500 : 400,
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        background: active ? "var(--bg-hover)" : "transparent",
        borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        transition: "color 0.12s ease, background 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = "var(--text-primary)"
          e.currentTarget.style.background = "var(--bg-hover)"
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = "var(--text-secondary)"
          e.currentTarget.style.background = "transparent"
        }
      }}
    >
      <Icon size={15} strokeWidth={active ? 2 : 1.5} />
      <span>{label}</span>
    </Link>
  )
}

function NavContent({ role }: Props) {
  const pathname = usePathname()

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 18px", borderBottom: "1px solid var(--border)" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            letterSpacing: "0.05em",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          CREDITAI
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            padding: "8px 20px 6px",
          }}
        >
          Platform
        </div>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <SidebarLink key={href} href={href} label={label} Icon={Icon} active={active} />
          )
        })}

        {role === "admin" && (
          <>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                padding: "16px 20px 6px",
              }}
            >
              Admin
            </div>
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <SidebarLink key={href} href={href} label={label} Icon={Icon} active={active} />
              )
            })}
          </>
        )}
      </nav>

      {/* Bottom — user initials */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--accent)",
            color: "var(--bg-void)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          TI
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            Tirth I.
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-tertiary)",
              letterSpacing: "0.05em",
            }}
          >
            RESEARCHER
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ role }: Props) {
  return (
    <aside
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
      <NavContent role={role} />
    </aside>
  )
}
