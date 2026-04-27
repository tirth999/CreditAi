"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Brain,
  Scale,
  Activity,
  Database,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAppStore } from "@/store/appStore"

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Application", href: "/dashboard/new-application", icon: PlusCircle },
  { label: "Score History", href: "/dashboard/scores", icon: List },
  { label: "XAI Explorer", href: "/dashboard/xai-explorer", icon: Brain },
  { label: "Fairness Audit", href: "/dashboard/fairness", icon: Scale },
  { label: "Drift Monitor", href: "/dashboard/drift", icon: Activity },
  { label: "Model Registry", href: "/dashboard/models", icon: Database },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

const ADMIN_NAV = [{ label: "Admin", href: "/dashboard/admin", icon: Shield }]

interface Props {
  role: string
}

function NavContent({ role }: Props) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}
        >
          CA
        </div>
        <span
          className="font-palatino text-lg tracking-wide"
          style={{ color: `rgb(var(--text))` }}
        >
          CreditAI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                active
                  ? "bg-gold-400/10 text-gold-400 border-l-2 border-gold-400 pl-4"
                  : "text-cream-200/60 hover:text-cream-100 hover:bg-white/5 pl-4"
              )}
              style={
                active
                  ? { background: "rgba(201,168,76,0.15)", color: "var(--accent-gold)", borderLeft: "2px solid var(--accent-gold)", paddingLeft: 14 }
                  : { color: "var(--text-muted)" }
              }
            >
              <Icon size={16} />
              <span>{label}</span>
              {active && <ChevronRight size={12} className="ml-auto opacity-60" />}
            </Link>
          )
        })}

        {role === "admin" && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Admin
              </span>
            </div>
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                  style={
                    active
                      ? { background: "rgba(201,168,76,0.15)", color: "var(--accent-gold)", borderLeft: "2px solid var(--accent-gold)", paddingLeft: 14 }
                      : { color: "var(--text-muted)", paddingLeft: 16 }
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t text-xs" style={{ borderColor: "var(--glass-border)", color: "var(--text-muted)" }}>
        v1.0.0 · CPSC 589
      </div>
    </>
  )
}

export function DashboardSidebar({ role }: Props) {
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-60 flex-shrink-0 flex-col border-r h-full"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          borderColor: "var(--glass-border)",
        }}
      >
        <NavContent role={role} />
      </aside>

      {/* Mobile sidebar via Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-60 p-0 flex flex-col"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--glass-border)",
          }}
        >
          <NavContent role={role} />
        </SheetContent>
      </Sheet>
    </>
  )
}
