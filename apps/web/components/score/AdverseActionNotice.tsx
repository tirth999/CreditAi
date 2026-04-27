import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle } from "lucide-react"

interface Reason {
  code: string
  plain_text: string
  shap_value: number
}

interface Props {
  reasons: Reason[]
}

export default function AdverseActionNotice({ reasons }: Props) {
  const top3 = reasons.slice(0, 3)

  return (
    <div>
      <Alert variant="destructive" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16 }}>
        <AlertTriangle size={18} />
        <AlertTitle style={{ fontFamily: "var(--font-palatino)", fontSize: 18 }}>Adverse Action Notice</AlertTitle>
        <AlertDescription>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
            Your application was declined or scored below the approval threshold. Under the Equal Credit Opportunity Act (ECOA), you are entitled to the following reasons:
          </p>
          <ol style={{ paddingLeft: 20, fontSize: 13 }}>
            {top3.map((r, i) => (
              <li key={i} style={{ marginBottom: 8, color: `rgb(var(--text))` }}>
                <strong style={{ color: "#ef4444" }}>{r.code}:</strong> {r.plain_text}
                <span style={{ color: "var(--text-muted)", fontSize: 11, marginLeft: 8 }}>(impact: {r.shap_value.toFixed(3)})</span>
              </li>
            ))}
          </ol>
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible style={{ marginTop: 16 }}>
        <AccordionItem value="rights" style={{ border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
          <AccordionTrigger style={{ padding: "14px 20px", color: `rgb(var(--text))`, fontSize: 14 }}>Credit Report Rights</AccordionTrigger>
          <AccordionContent style={{ padding: "0 20px 16px", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
            You have the right to obtain a free copy of your credit report from any consumer reporting agency that provided information used in this decision. You must request your report within 60 days of receiving this notice. The consumer reporting agency did not make the credit decision and cannot explain why the decision was made.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ecoa" style={{ border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden" }}>
          <AccordionTrigger style={{ padding: "14px 20px", color: `rgb(var(--text))`, fontSize: 14 }}>Applicant Rights (ECOA)</AccordionTrigger>
          <AccordionContent style={{ padding: "0 20px 16px", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
            The Equal Credit Opportunity Act prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, age, receipt of public assistance, or good faith exercise of rights under the Consumer Credit Protection Act. The federal agency that administers compliance is the Consumer Financial Protection Bureau (CFPB), 1700 G Street NW, Washington, DC 20552.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
