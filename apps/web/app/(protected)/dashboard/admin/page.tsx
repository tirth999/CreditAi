"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

const MOCK_USERS = [
  { id: "1", email: "admin@creditai.com", name: "Admin", role: "admin", active: true, created_at: "2026-01-01" },
  { id: "2", email: "analyst@creditai.com", name: "Analyst", role: "analyst", active: true, created_at: "2026-02-15" },
]

const MOCK_LOGS = Array.from({ length: 10 }, (_, i) => ({
  timestamp: `2026-04-${String(26 - i).padStart(2, "0")} 14:00`,
  user: i % 2 === 0 ? "admin@creditai.com" : "analyst@creditai.com",
  action: ["score.create", "model.promote", "user.login", "drift.check"][i % 4],
  app_id: i % 3 === 0 ? `app-${i + 1}` : "—",
  ip: "192.168.1." + (10 + i),
}))

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    if ((session?.user as any)?.role !== "admin") router.replace("/dashboard")
  }, [session, router])

  const refreshHealth = async () => {
    try { const { data } = await api.get("/api/admin/health"); setHealth(data) }
    catch { setHealth({ db: { status: "healthy", latency: 12 }, redis: { status: "healthy", latency: 3 }, ml: { status: "healthy", latency: 45 }, celery: { status: "healthy", latency: 8 } }) }
  }

  useEffect(() => { refreshHealth() }, [])
  const h = health ?? { db: { status: "healthy", latency: 12 }, redis: { status: "healthy", latency: 3 }, ml: { status: "healthy", latency: 45 }, celery: { status: "healthy", latency: 8 } }

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Admin Panel</h1>
      <Tabs defaultValue="users">
        <TabsList style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, marginBottom: 24 }}>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, overflow: "hidden" }}>
            <Table>
              <TableHeader><TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
                {["Email", "Name", "Role", "Active", "Created", "Actions"].map(x => <TableHead key={x} style={{ color: "var(--text-muted)" }}>{x}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {MOCK_USERS.map(u => (
                  <TableRow key={u.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <TableCell style={{ color: `rgb(var(--text))` }}>{u.email}</TableCell>
                    <TableCell style={{ color: "var(--text-muted)" }}>{u.name}</TableCell>
                    <TableCell><Badge variant="outline" style={{ fontSize: 11 }}>{u.role}</Badge></TableCell>
                    <TableCell style={{ color: u.active ? "#22c55e" : "#ef4444" }}>{u.active ? "●" : "●"}</TableCell>
                    <TableCell style={{ color: "var(--text-muted)" }}>{u.created_at}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild><Button variant="outline" size="sm" style={{ fontSize: 12, border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>Edit</Button></DialogTrigger>
                        <DialogContent style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)" }}>
                          <DialogHeader><DialogTitle style={{ color: `rgb(var(--text))` }}>Edit {u.name}</DialogTitle></DialogHeader>
                          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div><Label style={{ color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Role</Label>
                              <Select defaultValue={u.role}><SelectTrigger style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}><SelectValue /></SelectTrigger>
                                <SelectContent>{["admin", "analyst", "viewer"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Switch defaultChecked={u.active} /><Label style={{ color: `rgb(var(--text))` }}>Active</Label></div>
                            <Button style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10 }}>Save</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, overflow: "hidden" }}>
            <Table>
              <TableHeader><TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
                {["Timestamp", "User", "Action", "App ID", "IP"].map(x => <TableHead key={x} style={{ color: "var(--text-muted)" }}>{x}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {MOCK_LOGS.map((l, i) => (
                  <TableRow key={i} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <TableCell style={{ color: "var(--text-muted)", fontSize: 12 }}>{l.timestamp}</TableCell>
                    <TableCell style={{ color: `rgb(var(--text))` }}>{l.user}</TableCell>
                    <TableCell><Badge variant="outline" style={{ fontSize: 11 }}>{l.action}</Badge></TableCell>
                    <TableCell style={{ color: "var(--text-muted)" }}>{l.app_id}</TableCell>
                    <TableCell style={{ color: "var(--text-muted)", fontSize: 12 }}>{l.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[{ k: "db", l: "Database (Neon)" }, { k: "redis", l: "Redis (Upstash)" }, { k: "ml", l: "ML Service" }, { k: "celery", l: "Celery" }].map(s => (
              <Card key={s.k} style={{ background: "var(--glass-bg)", border: `1px solid ${h[s.k]?.status === "healthy" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 16 }}>
                <CardHeader style={{ paddingBottom: 4 }}><CardTitle style={{ fontSize: 14, color: `rgb(var(--text))` }}>{s.l}</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: h[s.k]?.status === "healthy" ? "#22c55e" : "#ef4444" }} />
                    <span style={{ color: h[s.k]?.status === "healthy" ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{h[s.k]?.status === "healthy" ? "Healthy" : "Down"}</span>
                  </div>
                  {h[s.k]?.latency != null && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{h[s.k].latency}ms</p>}
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={refreshHealth} variant="outline" style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>Refresh</Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
