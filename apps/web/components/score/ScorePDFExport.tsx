"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
)

interface ScoreData {
  score: number
  risk_tier: string
  probability_of_default: number
  confidence_lower?: number
  confidence_upper?: number
  shap_values?: Array<{ feature_name: string; shap_value: number }>
  adverse_action_reasons?: Array<{ code: string; plain_text: string }>
  fairness_metrics?: Record<string, number>
  model_version?: string
}

interface Props {
  scoreData: ScoreData
}

function ScoreDocumentWrapper({ scoreData }: Props) {
  const [DocComponent, setDocComponent] = useState<React.ComponentType<{ scoreData: ScoreData }> | null>(null)

  useEffect(() => {
    import("@react-pdf/renderer").then((pdf) => {
      const { Document, Page, Text, View, StyleSheet } = pdf

      const styles = StyleSheet.create({
        page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#1a1a1a" },
        header: { fontSize: 22, marginBottom: 4, color: "#0a0f1e" },
        subheader: { fontSize: 14, marginBottom: 20, color: "#64748b" },
        section: { marginBottom: 16 },
        sectionTitle: {
          fontSize: 13, fontWeight: "bold", marginBottom: 8, color: "#0a0f1e",
          borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4,
        },
        row: { flexDirection: "row" as const, justifyContent: "space-between" as const, marginBottom: 4 },
        label: { color: "#64748b" },
        value: { fontWeight: "bold" },
        footer: {
          position: "absolute" as const, bottom: 30, left: 40, right: 40,
          fontSize: 9, color: "#94a3b8", textAlign: "center" as const,
        },
        alert: { backgroundColor: "#fef2f2", padding: 10, borderRadius: 4, marginBottom: 8 },
        alertText: { color: "#dc2626", fontSize: 10 },
      })

      const Comp = ({ scoreData: sd }: { scoreData: ScoreData }) => (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.header}>CreditAI Score Report</Text>
            <Text style={styles.subheader}>Generated {new Date().toLocaleDateString()}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Score Summary</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Credit Score</Text>
                <Text style={styles.value}>{sd.score}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Risk Tier</Text>
                <Text style={styles.value}>{sd.risk_tier}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Probability of Default</Text>
                <Text style={styles.value}>{(sd.probability_of_default * 100).toFixed(1)}%</Text>
              </View>
              {sd.confidence_lower != null && sd.confidence_upper != null && (
                <View style={styles.row}>
                  <Text style={styles.label}>95% Confidence Interval</Text>
                  <Text style={styles.value}>{sd.confidence_lower} – {sd.confidence_upper}</Text>
                </View>
              )}
              {sd.model_version && (
                <View style={styles.row}>
                  <Text style={styles.label}>Model Version</Text>
                  <Text style={styles.value}>{sd.model_version}</Text>
                </View>
              )}
            </View>

            {sd.shap_values && sd.shap_values.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Factors (SHAP)</Text>
                {sd.shap_values.slice(0, 5).map((sv, i) => (
                  <View key={i} style={styles.row}>
                    <Text style={styles.label}>{sv.feature_name.replace(/_/g, " ")}</Text>
                    <Text style={{ ...styles.value, color: sv.shap_value > 0 ? "#0d9488" : "#dc2626" }}>
                      {sv.shap_value > 0 ? "+" : ""}{sv.shap_value.toFixed(4)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {sd.adverse_action_reasons && sd.adverse_action_reasons.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Adverse Action Notice</Text>
                <View style={styles.alert}>
                  {sd.adverse_action_reasons.map((r, i) => (
                    <Text key={i} style={styles.alertText}>{r.code}: {r.plain_text}</Text>
                  ))}
                </View>
              </View>
            )}

            {sd.fairness_metrics && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fairness Metrics</Text>
                {Object.entries(sd.fairness_metrics).map(([k, v]) => (
                  <View key={k} style={styles.row}>
                    <Text style={styles.label}>{k.replace(/_/g, " ")}</Text>
                    <Text style={styles.value}>{typeof v === "number" ? v.toFixed(4) : String(v)}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.footer}>
              Generated by CreditAI · CPSC 589 · Tirth Isamaliya · California State University Fullerton
            </Text>
          </Page>
        </Document>
      )

      setDocComponent(() => Comp)
    })
  }, [])

  if (!DocComponent) {
    return (
      <Button variant="outline" disabled style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, gap: 8 }}>
        <Download size={16} />
        Loading PDF...
      </Button>
    )
  }

  return (
    <PDFDownloadLink document={<DocComponent scoreData={scoreData} />} fileName={`creditai-report-${scoreData.score}.pdf`}>
      {(({ loading }: { loading: boolean }) => (
        <Button variant="outline" disabled={loading}
          style={{ border: "1px solid var(--glass-border)", color: `rgb(var(--text))`, gap: 8 }}>
          <Download size={16} />
          {loading ? "Generating PDF..." : "Download Report"}
        </Button>
      )) as any}
    </PDFDownloadLink>
  )
}

export default function ScorePDFExport({ scoreData }: Props) {
  return <ScoreDocumentWrapper scoreData={scoreData} />
}
