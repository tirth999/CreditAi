import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  lower: number
  upper: number
  score: number
}

export default function ConfidenceInterval({ lower, upper, score }: Props) {
  const min = 300
  const max = 850
  const range = max - min
  const leftPct = ((lower - min) / range) * 100
  const widthPct = ((upper - lower) / range) * 100
  const scorePct = ((score - min) / range) * 100

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div style={{ width: "100%", maxWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
              <span>{lower}</span>
              <span style={{ color: `rgb(var(--text))`, fontWeight: 600, fontSize: 12 }}>95% CI</span>
              <span>{upper}</span>
            </div>
            <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "visible" }}>
              <div style={{
                position: "absolute", height: "100%", borderRadius: 4,
                left: `${leftPct}%`, width: `${widthPct}%`,
                background: "linear-gradient(90deg, rgba(20,184,166,0.3), rgba(20,184,166,0.5))",
                border: "1px solid rgba(20,184,166,0.4)",
              }} />
              <div style={{
                position: "absolute", top: -3, width: 14, height: 14, borderRadius: "50%",
                background: "#d4a84b", border: "2px solid #0a0f1e",
                left: `${scorePct}%`, transform: "translateX(-50%)",
              }} />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(212,168,75,0.3)", color: "#f5f0e8" }}>
          <p style={{ fontSize: 12 }}>
            <strong>Conformal Prediction Interval</strong><br />
            Your score falls between {lower}–{upper} with 95% confidence.<br />
            This uses split conformal prediction for distribution-free coverage guarantees.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
