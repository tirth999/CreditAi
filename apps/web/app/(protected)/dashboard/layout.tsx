import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { DashboardTopbar } from "@/components/layout/DashboardTopbar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-void)",
      }}
    >
      <DashboardSidebar role={session.user.role} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <DashboardTopbar user={session.user} />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            background: "var(--bg-void)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
