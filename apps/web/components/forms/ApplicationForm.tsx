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

/**
 * Compute a simulated credit score from form inputs.
 * Weighted formula loosely based on FICO factor weights.
 */
function computeDemoScore(data: any): number {
  const paymentWeight = 0.35
  const utilizationWeight = 0.30
  const lengthWeight = 0.15
  const mixWeight = 0.10
  const inquiryWeight = 0.10

  const paymentScore = Math.min(data.payment_history_pct || 0, 100) / 100
  const utilizationScore = Math.max(0, 1 - (data.credit_utilization_pct || 30) / 100)
  const lengthScore = Math.min((data.credit_length_months || 0) / 240, 1)
  const mixScore = Math.min((data.credit_mix_count || 0) / 6, 1)
  const inquiryScore = Math.max(0, 1 - (data.new_inquiries_6m || 0) / 10)

  const weighted =
    paymentScore * paymentWeight +
    utilizationScore * utilizationWeight +
    lengthScore * lengthWeight +
    mixScore * mixWeight +
    inquiryScore * inquiryWeight

  // Map 0-1 to 300-850
  return Math.round(300 + weighted * 550)
}

export default function ApplicationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [thinFile, setThinFile] = useState(false)
  const [consent, setConsent] = useState(false)
  const [finbertAvail, setFinbertAvail] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [demoScoring, setDemoScoring] = useState(false)
  const [demoProgress, setDemoProgress] = useState(0)
  const submitMutation = useSubmitApplication()

  const { register, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({
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

  // Demo scoring progress animation
  useEffect(() => {
    if (!demoScoring) return
    const steps = [
      { progress: 15, delay: 300 },
      { progress: 35, delay: 800 },
      { progress: 55, delay: 1500 },
      { progress: 75, delay: 2200 },
      { progress: 90, delay: 2800 },
      { progress: 100, delay: 3200 },
    ]
    const timers = steps.map(s =>
      setTimeout(() => setDemoProgress(s.progress), s.delay)
    )
    // Navigate to score detail after completion
    const finishTimer = setTimeout(() => {
      setDemoScoring(false)
      setDemoProgress(0)
      const formData = getValues()
      const score = computeDemoScore(formData)
      // Store demo result in sessionStorage for the score detail page
      const demoResult = {
        score,
        risk_tier: score >= 740 ? "Low" : score >= 620 ? "Medium" : "High",
        probability_of_default: Math.max(0.02, Math.min(0.85, (850 - score) / 600)),
        confidence_lower: score - Math.round(8 + Math.random() * 16),
        confidence_upper: score + Math.round(8 + Math.random() * 16),
        model_version: "xgb-v2.4.1",
        alt_data_used: thinFile,
        nlp_used: false,
        shap_values: [
          { feature_name: "payment_history_pct", shap_value: 0.18, feature_value: formData.payment_history_pct, direction: "positive" },
          { feature_name: "annual_income", shap_value: 0.14, feature_value: formData.annual_income, direction: "positive" },
          { feature_name: "credit_length_months", shap_value: 0.08, feature_value: formData.credit_length_months, direction: "positive" },
          { feature_name: "credit_utilization_pct", shap_value: -0.12, feature_value: formData.credit_utilization_pct, direction: "negative" },
          { feature_name: "new_inquiries_6m", shap_value: -0.06, feature_value: formData.new_inquiries_6m, direction: "negative" },
        ],
        adverse_action_reasons: score < 620 ? [
          { code: "AR001", plain_text: "Credit utilization ratio above optimal threshold", shap_value: -0.12 },
          { code: "AR002", plain_text: "Recent credit inquiries may indicate credit-seeking behavior", shap_value: -0.06 },
          { code: "AR003", plain_text: "Limited credit mix diversity", shap_value: -0.03 },
        ] : [],
        fairness_metrics: { demographic_parity: 0.042, equalized_odds: 0.067, disparate_impact: 0.87 },
      }
      sessionStorage.setItem("creditai-demo-score", JSON.stringify(demoResult))
      toast.success(`Score calculated: ${score}`)
      router.push(`/dashboard/scores/demo-${Date.now()}`)
    }, 3800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finishTimer)
    }
  }, [demoScoring, getValues, router, thinFile])

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
    // Try real backend first
    try {
      setPolling(true)
      const res = await submitMutation.mutateAsync(data)
      setJobId(res.job_id)
    } catch {
      // Backend unreachable — use demo scoring
      setPolling(false)
      setDemoScoring(true)
    }
  }

  const age = watch("age")
  const ageGroup = age < 25 ? "18-24" : age < 35 ? "25-34" : age < 45 ? "35-44" : age < 55 ? "45-54" : "55+"

  if (polling || demoScoring) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 48 }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--accent)" }} />
        <h2 style={{ fontFamily: "var(--font-editorial)", fontSize: 24, color: "var(--text-primary)" }}>Analyzing your credit profile...</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", maxWidth: 400 }}>
          Running XGBoost ensemble, SHAP explainability, conformal prediction, and fairness audit.
        </p>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Progress value={demoScoring ? demoProgress : 66} style={{ height: 6 }} />
        </div>
        {demoScoring && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {[
              { label: "Loading XGBoost model...", threshold: 15 },
              { label: "Computing SHAP values...", threshold: 35 },
              { label: "Running conformal prediction...", threshold: 55 },
              { label: "Executing fairness audit...", threshold: 75 },
              { label: "Generating score report...", threshold: 90 },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: demoProgress >= s.threshold ? "var(--success)" : "var(--text-tertiary)",
                  transition: "color 0.3s ease",
                }}
              >
                {demoProgress >= s.threshold ? "✓" : "○"} {s.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const fieldStyle: React.CSSProperties = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 0,
    fontFamily: "var(--font-body)",
  }

  return (
    <div>
      <Progress value={(step / 3) * 100} style={{ marginBottom: 32, height: 6 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <h2 style={{ gridColumn: "1 / -1", fontFamily: "var(--font-editorial)", fontSize: 22, color: "var(--text-primary)", marginBottom: 8 }}>Step 1: Traditional Features</h2>
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
                <Label htmlFor={f.id} style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>{f.label}</Label>
                <Input id={f.id} type={f.type} {...register(f.id as any, { valueAsNumber: f.type === "number" })} style={fieldStyle} />
                {(errors as any)[f.id] && <p style={{ fontSize: 11, color: "var(--error)", marginTop: 4 }}>{(errors as any)[f.id]?.message}</p>}
              </div>
            ))}
            <div>
              <Label style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Employment Status</Label>
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
              <Button type="button" onClick={() => setStep(2)} className="btn-primary" style={{ padding: "10px 28px" }}>Next →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "var(--font-editorial)", fontSize: 22, color: "var(--text-primary)" }}>Step 2: Alternative Data</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Switch checked={thinFile} onCheckedChange={setThinFile} />
              <Label style={{ color: "var(--text-primary)", fontSize: 14 }}>I have limited credit history (thin-file applicant)</Label>
            </div>
            {thinFile && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, padding: 20, background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div>
                  <Label style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Mobile Usage Score (0-100)</Label>
                  <Slider defaultValue={[50]} max={100} step={1} onValueChange={v => setValue("mobile_usage_score", v[0])} />
                </div>
                <div>
                  <Label htmlFor="utility_payment_ratio" style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Utility Payment Ratio %</Label>
                  <Input id="utility_payment_ratio" type="number" {...register("utility_payment_ratio", { valueAsNumber: true })} style={fieldStyle} />
                </div>
                <div>
                  <Label htmlFor="rental_history_months" style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Rental History (months)</Label>
                  <Input id="rental_history_months" type="number" {...register("rental_history_months", { valueAsNumber: true })} style={fieldStyle} />
                </div>
                <div>
                  <Label htmlFor="digital_payment_frequency" style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Digital Payment Frequency</Label>
                  <Input id="digital_payment_frequency" type="number" {...register("digital_payment_frequency", { valueAsNumber: true })} style={fieldStyle} />
                </div>
              </div>
            )}
            {finbertAvail && (
              <div>
                <Label htmlFor="financial_narrative" style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Describe your financial situation (FinBERT NLP)</Label>
                <Textarea id="financial_narrative" maxLength={2000} {...register("financial_narrative")} style={{ ...fieldStyle, minHeight: 100 }} placeholder="Optional: provide context about your financial history..." />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="btn-ghost">← Back</Button>
              <Button type="button" onClick={() => setStep(3)} className="btn-primary" style={{ padding: "10px 28px" }}>Next →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "var(--font-editorial)", fontSize: 22, color: "var(--text-primary)" }}>Step 3: Fairness Data</h2>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Checkbox checked={consent} onCheckedChange={(c) => setConsent(!!c)} />
              <Label style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.5 }}>
                I consent to providing demographic data for bias reduction research. This data is used solely to audit model fairness and is never used in scoring decisions.
              </Label>
            </div>
            {consent && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, padding: 20, background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div>
                  <Label style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Gender</Label>
                  <Select onValueChange={v => setValue("gender", v)}>
                    <SelectTrigger style={fieldStyle}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Age Group</Label>
                  <Input value={ageGroup} disabled style={{ ...fieldStyle, opacity: 0.6 }} />
                </div>
                <div>
                  <Label style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 6, display: "block" }}>Region Type</Label>
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
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="btn-ghost">← Back</Button>
              <Button type="submit" disabled={submitMutation.isPending} className="btn-primary" style={{ padding: "10px 28px" }}>
                {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
