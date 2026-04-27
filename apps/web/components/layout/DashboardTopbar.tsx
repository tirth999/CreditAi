"use client"

import { signOut } from "next-auth/react"
import { Menu, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/store/appStore"
import Link from "next/link"

interface Props {
  user: { id?: string; name?: string | null; email?: string | null; role?: string }
}

function getInitials(name?: string | null): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function DashboardTopbar({ user }: Props) {
  const { setSidebarOpen } = useAppStore()

  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(24px)",
        borderColor: "var(--glass-border)",
      }}
    >
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-medium md:hidden" style={{ color: `rgb(var(--text))` }}>
          CreditAI
        </span>
      </div>

      {/* Right: Avatar + DropdownMenu */}
      <div className="flex items-center gap-3 ml-auto">
        <span
          className="hidden sm:inline text-xs px-2 py-0.5 rounded-full capitalize"
          style={{
            background: "rgba(201,168,76,0.15)",
            color: "var(--accent-gold)",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        >
          {user.role ?? "user"}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-400/30">
              <Avatar className="h-8 w-8 cursor-pointer" style={{ border: "1px solid var(--glass-border)" }}>
                <AvatarFallback
                  style={{
                    background: "rgba(201,168,76,0.15)",
                    color: "var(--accent-gold)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(24px)",
            }}
          >
            <DropdownMenuLabel style={{ color: `rgb(var(--text))` }}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name ?? "User"}</span>
                <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                  {user.email ?? ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "var(--glass-border)" }} />
            <DropdownMenuItem asChild className="cursor-pointer" style={{ color: `rgb(var(--text))` }}>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <User size={14} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: "var(--glass-border)" }} />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="cursor-pointer"
              style={{ color: "#ef4444" }}
            >
              <LogOut size={14} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
