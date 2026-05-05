import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardShellWrapper } from "@/components/layout/DashboardShellWrapper"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <DashboardShellWrapper
      role={session.user.role}
      user={session.user}
    >
      {children}
    </DashboardShellWrapper>
  )
}
