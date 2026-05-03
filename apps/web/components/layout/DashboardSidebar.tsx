"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, PlusCircle, List, Brain,
  Scale, Activity, Database, Settings, Shield,
} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAppStore } from "@/store/appStore"

const NAV = [
  { label: "Overview",        href: "/dashboard",                  icon: LayoutDashboard },
  { label: "New Application", href: "/dashboard/new-application",  icon: PlusCircle },
  { label: "Score History",   href: "/dashboard/scores",           icon: List },
  { label: "XAI Explorer",    href: "/dashboard/xai-explorer",     icon: Brain },
  { label: "Fairness Audit",  href: "/dashboard/fairness",         icon: Scale },
  { label: "Drift Monitor",   href: "/dashboard/drift",            icon: Activity },
  { label: "Model Registry",  href: "/dashboard/models",           icon: Database },
  { label: "Settings",        href: "/dashboard/settings",         icon: Settings },
]

const ADMIN_NAV = [{ label: "Admin", href: "/dashboard/admin", icon: Shield }]

interface Props { role: string }

function SidebarLink({ href, label, Icon, active }: { href: string; label: string; Icon: any; active: boolean }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 16px",
      borderRadius: 0,
      fontSize: 13,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: active ? 500 : 400,
      color: active ? "var(--accent)" : "var(--neutral)",
      textDecoration: "none",
      background: active ? "rgba(200,169,110,0.08)" : "transparent",
      borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
      transition: "color 0.2s ease, background 0.2s ease, border-color 0.2s ease",
    }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = "var(--brand)"
          e.currentTarget.style.background = "var(--bg-raised)"
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = "var(--neutral)"
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
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, letterSpacing: "0.1em", color: "var(--brand)", textDecoration: "none", fontWeight: 400 }}>
          CREDITAI
        </Link>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--neutral)", letterSpacing: "0.06em", marginTop: 3 }}>CPSC 589 · Spring 2026</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral)", padding: "8px 20px 6px" }}>
          Platform
        </div>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return <SidebarLink key={href} href={href} label={label} Icon={Icon} active={active} />
        })}

        {role === "admin" && (
          <>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral)", padding: "16px 20px 6px" }}>
              Admin
            </div>
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return <SidebarLink key={href} href={href} label={label} Icon={Icon} active={active} />
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--neutral)", lineHeight: 1.6 }}>
          v1.0.0-alpha
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ role }: Props) {
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Desktop sidebar — 240px fixed */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        height: "100%",
        display: "flex", flexDirection: "column",
      }}
        className="hidden md:flex"
      >
        <NavContent role={role} />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" style={{ width: 240, padding: 0, background: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <NavContent role={role} />
        </SheetContent>
      </Sheet>
    </>
  )
}
