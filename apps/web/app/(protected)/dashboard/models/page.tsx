"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import ModelComparison from "@/components/charts/ModelComparison"
import { useModels, usePromoteModel } from "@/hooks/useModels"

const MOCK_MODELS = [
  { version: "xgb-v2.1", algorithm: "XGBoost", dataset: "combined-6ds", auc: 0.852, f1: 0.81, gini: 0.70, accuracy: 0.84, fairness: 0.92, train_date: "2026-04-15", status: "active" },
  { version: "xgb-v2.0", algorithm: "XGBoost", dataset: "kaggle-home", auc: 0.838, f1: 0.79, gini: 0.68, accuracy: 0.82, fairness: 0.88, train_date: "2026-03-20", status: "archived" },
  { version: "lgb-v1.5", algorithm: "LightGBM", dataset: "german-credit", auc: 0.821, f1: 0.77, gini: 0.64, accuracy: 0.80, fairness: 0.90, train_date: "2026-02-10", status: "archived" },
  { version: "ebm-v1.0", algorithm: "EBM", dataset: "combined-6ds", auc: 0.808, f1: 0.75, gini: 0.62, accuracy: 0.79, fairness: 0.96, train_date: "2026-01-05", status: "archived" },
]

const MOCK_IMPORTANCE = [
  { feature: "payment history", importance: 0.28 }, { feature: "credit utilization", importance: 0.22 },
  { feature: "annual income", importance: 0.15 }, { feature: "credit length", importance: 0.12 },
  { feature: "amounts owed", importance: 0.10 }, { feature: "new inquiries", importance: 0.08 },
]

export default function ModelsPage() {
  const { data: session } = useSession()
  const { data: rawModels } = useModels()
  const promote = usePromoteModel()
  const [selected, setSelected] = useState<string | null>(null)
  const data = ((rawModels as any[]) ?? MOCK_MODELS).map((m: any) => ({
    version: m.version ?? "",
    algorithm: m.algorithm ?? "",
    dataset: m.dataset ?? "",
    auc: m.auc ?? m.auc_roc ?? 0,
    f1: m.f1 ?? m.f1_score ?? 0,
    gini: m.gini ?? m.gini_coefficient ?? 0,
    accuracy: m.accuracy ?? 0,
    fairness: m.fairness ?? 0,
    train_date: m.train_date?.slice(0, 10) ?? "",
    status: m.status ?? (m.is_active ? "active" : "archived"),
  }))
  const isAdmin = (session?.user as any)?.role === "admin"

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-palatino)", fontSize: 28, color: `rgb(var(--text))`, marginBottom: 24 }}>Model Registry</h1>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, overflow: "hidden", marginBottom: 32 }}>
        <Table>
          <TableHeader><TableRow style={{ borderBottom: "1px solid var(--glass-border)" }}>
            {["Version", "Algorithm", "Dataset", "AUC", "F1", "Gini", "Train Date", "Status"].map(h => <TableHead key={h} style={{ color: "var(--text-muted)" }}>{h}</TableHead>)}
          </TableRow></TableHeader>
          <TableBody>
            {data.map((m: any) => (
              <TableRow key={m.version} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <TableCell style={{ color: `rgb(var(--text))`, fontWeight: 600 }}>{m.version}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{m.algorithm}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{m.dataset}</TableCell>
                <TableCell style={{ color: "#14b8a6", fontWeight: 600 }}>{m.auc.toFixed(3)}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{m.f1.toFixed(2)}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{m.gini.toFixed(2)}</TableCell>
                <TableCell style={{ color: "var(--text-muted)" }}>{m.train_date}</TableCell>
                <TableCell>
                  <Badge style={{ background: m.status === "active" ? "rgba(212,168,75,0.15)" : "rgba(100,116,139,0.15)", color: m.status === "active" ? "#d4a84b" : "#64748b", border: `1px solid ${m.status === "active" ? "rgba(212,168,75,0.3)" : "rgba(100,116,139,0.3)"}` }}>
                    {m.status === "active" ? "Active" : "Archived"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>Champion/Challenger Comparison</h2>
        <ModelComparison models={data} />
      </div>

      <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 20, color: `rgb(var(--text))`, marginBottom: 20 }}>Feature Importance</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={MOCK_IMPORTANCE} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} /><YAxis dataKey="feature" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", borderRadius: 8, color: "#f5f0e8" }} />
            <Bar dataKey="importance" fill="#14b8a6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isAdmin && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10 }}>Promote to Production</Button>
          </AlertDialogTrigger>
          <AlertDialogContent style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)" }}>
            <AlertDialogHeader>
              <AlertDialogTitle style={{ color: `rgb(var(--text))` }}>Promote Model?</AlertDialogTitle>
              <AlertDialogDescription style={{ color: "var(--text-muted)" }}>This will replace the current production model. All new scoring requests will use the promoted model.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))` }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => promote.mutate(selected ?? data[1]?.version)} style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
