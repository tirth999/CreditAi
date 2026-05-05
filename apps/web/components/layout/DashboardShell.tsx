"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

interface Props {
  sidebar: React.ReactNode
  topbar: React.ReactNode
  children: React.ReactNode
}

export function DashboardShell({ sidebar, topbar, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-shell" style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-void)" }}>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        {sidebar}
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minWidth: 0 }}>
        {/* Topbar with hamburger */}
        <div className="dashboard-topbar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{ flex: 1 }}>{topbar}</div>
        </div>

        <main className="dashboard-main" style={{ flex: 1, overflowY: "auto", padding: 24, background: "var(--bg-void)" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
