"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import api from "@/lib/api"

const fieldStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10 }

export default function SettingsPage() {
  const { data: session } = useSession()
  const [delPw, setDelPw] = useState("")
  const [notifs, setNotifs] = useState({ drift: true, model: true, fairness: false })

  const profile = useForm({ defaultValues: { name: session?.user?.name ?? "", email: session?.user?.email ?? "" } })
  const security = useForm({ defaultValues: { current: "", newPw: "", confirm: "" } })

  const onProfile = async (data: any) => {
    try { await api.patch("/api/users/me", data); toast.success("Profile updated") } catch { toast.error("Failed to update") }
  }
  const onSecurity = async (data: any) => {
    if (data.newPw !== data.confirm) { toast.error("Passwords don't match"); return }
    try { await api.post("/api/users/me/password", { current_password: data.current, new_password: data.newPw }); toast.success("Password changed"); security.reset() } catch { toast.error("Failed") }
  }
  const downloadData = async () => {
    try {
      const { data } = await api.get("/api/users/me/data")
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a"); a.href = url; a.download = "creditai-data.json"; a.click()
      URL.revokeObjectURL(url); toast.success("Data downloaded")
    } catch { toast.error("Failed to download data") }
  }
  const deleteAccount = async () => {
    try { await api.delete("/api/users/me", { data: { password: delPw } }); toast.success("Account deleted"); window.location.href = "/" } catch { toast.error("Failed — check password") }
  }

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Settings</h1>
      <Tabs defaultValue="profile">
        <TabsList style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, marginBottom: 24 }}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, maxWidth: 480 }}>
            <form onSubmit={profile.handleSubmit(onProfile)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Full Name</Label>
                <Input {...profile.register("name")} style={fieldStyle} /></div>
              <div><Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Email</Label>
                <Input {...profile.register("email")} type="email" style={fieldStyle} /></div>
              <Button type="submit" style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10, width: "fit-content" }}>Save Changes</Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, maxWidth: 480 }}>
            <form onSubmit={security.handleSubmit(onSecurity)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Current Password</Label>
                <Input {...security.register("current")} type="password" style={fieldStyle} /></div>
              <div><Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>New Password</Label>
                <Input {...security.register("newPw")} type="password" style={fieldStyle} /></div>
              <div><Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm New Password</Label>
                <Input {...security.register("confirm")} type="password" style={fieldStyle} /></div>
              <Button type="submit" style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10, width: "fit-content" }}>Change Password</Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, maxWidth: 480, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 18, color: `rgb(var(--text))`, marginBottom: 8 }}>Download My Data</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>Export all your scores, applications, and account data as JSON.</p>
              <Button onClick={downloadData} variant="outline" style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>Download Data</Button>
            </div>
            <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 20 }}>
              <h3 style={{ fontFamily: "var(--font-palatino)", fontSize: 18, color: "#ef4444", marginBottom: 8 }}>Delete My Account</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>Permanently delete your account and all associated data. This cannot be undone.</p>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive">Delete Account</Button></AlertDialogTrigger>
                <AlertDialogContent style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)" }}>
                  <AlertDialogHeader>
                    <AlertDialogTitle style={{ color: `rgb(var(--text))` }}>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription style={{ color: "var(--text-muted)" }}>Enter your password to confirm permanent deletion.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input type="password" placeholder="Password" value={delPw} onChange={e => setDelPw(e.target.value)} style={fieldStyle} />
                  <AlertDialogFooter>
                    <AlertDialogCancel style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount} style={{ background: "#ef4444", color: "#fff" }}>Delete Forever</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 32, maxWidth: 480, display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { key: "drift", label: "Email on drift detected" },
              { key: "model", label: "Email on model updated" },
              { key: "fairness", label: "Email on fairness alert" },
            ].map(n => (
              <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Label style={{ color: `rgb(var(--text))`, fontSize: 14 }}>{n.label}</Label>
                <Switch checked={(notifs as any)[n.key]} onCheckedChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
              </div>
            ))}
            <Button style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10, width: "fit-content" }}
              onClick={() => toast.success("Notification preferences saved")}>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
