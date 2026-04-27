"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { applicationSchema } from "@/lib/validations"
import { useSubmitApplication } from "@/hooks/useScore"
import useInterval from "@/hooks/useInterval"
import api from "@/lib/api"

export default function ApplicationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [thinFile, setThinFile] = useState(false)
  const [consent, setConsent] = useState(false)
  const [finbertAvail, setFinbertAvail] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const submitMutation = useSubmitApplication()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      payment_history_pct: 95, amounts_owed: 5000, credit_utilization_pct: 30,
      credit_length_months: 60, new_inquiries_6m: 1, credit_mix_count: 3,
      annual_income: 65000, employment_status: "employed", zip_code: "90001", age: 30,
      mobile_usage_score: 50, utility_payment_ratio: 90, rental_history_months: 24,
      digital_payment_frequency: 15, financial_narrative: "",
      gender: "", age_group: "", region_type: "",
    },
  })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001"}/ml/health`)
      .then(r => r.json())
      .then(d => setFinbertAvail(d?.finbert_available ?? false))
      .catch(() => setFinbertAvail(false))
  }, [])

  useInterval(async () => {
    if (!jobId) return
    try {
      const { data } = await api.get(`/api/score/status/${jobId}`)
      if (data.status === "completed") {
        setPolling(false)
        setJobId(null)
        toast.success("Score calculated!")
        router.push(`/dashboard/scores/${data.score_id}`)
      } else if (data.status === "failed") {
        setPolling(false)
        setJobId(null)
        toast.error("Scoring failed. Please try again.")
      }
    } catch { /* continue polling */ }
  }, polling ? 2000 : null)

  const onSubmit = async (data: any) => {
    try {
      setPolling(true)
      const res = await submitMutation.mutateAsync(data)
      setJobId(res.job_id)
    } catch {
      setPolling(false)
      toast.error("Failed to submit application")
    }
  }

  const age = watch("age")
  const ageGroup = age < 25 ? "18-24" : age < 35 ? "25-34" : age < 45 ? "35-44" : age < 55 ? "45-54" : "55+"

  if (polling) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 48 }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
        <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 24, color: `rgb(var(--text))` }}>Analyzing your credit profile...</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Running XGBoost ensemble, SHAP explainability, and fairness audit.</p>
        <Progress value={66} style={{ maxWidth: 400 }} />
      </div>
    )
  }

  const fieldStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10 }

  return (
    <div>
      <Progress value={(step / 3) * 100} style={{ marginBottom: 32, height: 6 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <h2 style={{ gridColumn: "1 / -1", fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))`, marginBottom: 8 }}>Step 1: Traditional Features</h2>
            {[
              { id: "payment_history_pct", label: "Payment History %", type: "number" },
              { id: "amounts_owed", label: "Amounts Owed ($)", type: "number" },
              { id: "credit_utilization_pct", label: "Credit Utilization %", type: "number" },
              { id: "credit_length_months", label: "Credit Length (months)", type: "number" },
              { id: "new_inquiries_6m", label: "New Inquiries (6mo)", type: "number" },
              { id: "credit_mix_count", label: "Credit Mix Count", type: "number" },
              { id: "annual_income", label: "Annual Income ($)", type: "number" },
              { id: "zip_code", label: "Zip Code", type: "text" },
              { id: "age", label: "Age", type: "number" },
            ].map(f => (
              <div key={f.id}>
                <Label htmlFor={f.id} style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>{f.label}</Label>
                <Input id={f.id} type={f.type} {...register(f.id as any, { valueAsNumber: f.type === "number" })} style={fieldStyle} />
                {(errors as any)[f.id] && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{(errors as any)[f.id]?.message}</p>}
              </div>
            ))}
            <div>
              <Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Employment Status</Label>
              <Select defaultValue="employed" onValueChange={v => setValue("employment_status", v)}>
                <SelectTrigger style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["employed", "self-employed", "unemployed", "retired", "student"].map(s => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <Button type="button" onClick={() => setStep(2)} style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10, padding: "10px 28px" }}>Next →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))` }}>Step 2: Alternative Data</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Switch checked={thinFile} onCheckedChange={setThinFile} />
              <Label style={{ color: `rgb(var(--text))`, fontSize: 14 }}>I have limited credit history</Label>
            </div>
            {thinFile && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, padding: 20, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
                <div>
                  <Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Mobile Usage Score (0-100)</Label>
                  <Slider defaultValue={[50]} max={100} step={1} onValueChange={v => setValue("mobile_usage_score", v[0])} />
                </div>
                <div>
                  <Label htmlFor="utility_payment_ratio" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Utility Payment Ratio %</Label>
                  <Input id="utility_payment_ratio" type="number" {...register("utility_payment_ratio", { valueAsNumber: true })} style={fieldStyle} />
                </div>
                <div>
                  <Label htmlFor="rental_history_months" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Rental History (months)</Label>
                  <Input id="rental_history_months" type="number" {...register("rental_history_months", { valueAsNumber: true })} style={fieldStyle} />
                </div>
                <div>
                  <Label htmlFor="digital_payment_frequency" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Digital Payment Frequency</Label>
                  <Input id="digital_payment_frequency" type="number" {...register("digital_payment_frequency", { valueAsNumber: true })} style={fieldStyle} />
                </div>
              </div>
            )}
            {finbertAvail && (
              <div>
                <Label htmlFor="financial_narrative" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Describe your financial situation</Label>
                <Textarea id="financial_narrative" maxLength={2000} {...register("financial_narrative")} style={{ ...fieldStyle, minHeight: 100 }} placeholder="Optional: provide context about your financial history..." />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <Button type="button" variant="outline" onClick={() => setStep(1)} style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10 }}>← Back</Button>
              <Button type="button" onClick={() => setStep(3)} style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10, padding: "10px 28px" }}>Next →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "var(--font-palatino)", fontSize: 22, color: `rgb(var(--text))` }}>Step 3: Fairness Data</h2>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Checkbox checked={consent} onCheckedChange={(c) => setConsent(!!c)} />
              <Label style={{ color: `rgb(var(--text))`, fontSize: 14, lineHeight: 1.5 }}>
                I consent to providing demographic data for bias reduction research. This data is used solely to audit model fairness and is never used in scoring decisions.
              </Label>
            </div>
            {consent && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, padding: 20, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 16 }}>
                <div>
                  <Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Gender</Label>
                  <Select onValueChange={v => setValue("gender", v)}>
                    <SelectTrigger style={fieldStyle}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Age Group</Label>
                  <Input value={ageGroup} disabled style={{ ...fieldStyle, opacity: 0.6 }} />
                </div>
                <div>
                  <Label style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6, display: "block" }}>Region Type</Label>
                  <Select onValueChange={v => setValue("region_type", v)}>
                    <SelectTrigger style={fieldStyle}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Urban", "Suburban", "Rural"].map(r => <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <Button type="button" variant="outline" onClick={() => setStep(2)} style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, borderRadius: 10 }}>← Back</Button>
              <Button type="submit" disabled={submitMutation.isPending} style={{ background: "var(--accent-gold)", color: "var(--bg-primary)", fontWeight: 600, borderRadius: 10, padding: "10px 28px" }}>
                {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
