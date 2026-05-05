/**
 * Simple in-memory + sessionStorage store for demo-scored applications.
 * In production this would come from the backend API.
 */

export interface DemoScore {
  id: string
  score: number
  risk_tier: string
  confidence: string
  date: string
  probability_of_default: number
  shap_values: any[]
  adverse_action_reasons: any[]
  fairness_metrics: any
  model_version: string
  alt_data_used: boolean
  nlp_used: boolean
  confidence_lower: number
  confidence_upper: number
}

const STORAGE_KEY = "creditai-demo-scores"

function loadScores(): DemoScore[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveScores(scores: DemoScore[]) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export function addDemoScore(result: any, id: string): void {
  const scores = loadScores()
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const confRange = Math.abs((result.confidence_upper ?? result.score + 12) - result.score)

  const entry: DemoScore = {
    id,
    score: result.score,
    risk_tier: result.risk_tier,
    confidence: `±${confRange}`,
    date: dateStr,
    probability_of_default: result.probability_of_default,
    shap_values: result.shap_values,
    adverse_action_reasons: result.adverse_action_reasons ?? [],
    fairness_metrics: result.fairness_metrics,
    model_version: result.model_version ?? "xgb-v2.4.1",
    alt_data_used: result.alt_data_used ?? false,
    nlp_used: result.nlp_used ?? false,
    confidence_lower: result.confidence_lower ?? result.score - 12,
    confidence_upper: result.confidence_upper ?? result.score + 12,
  }

  scores.unshift(entry)
  saveScores(scores)

  // Also store for the detail page
  sessionStorage.setItem("creditai-demo-score", JSON.stringify(result))
}

export function getDemoScores(): DemoScore[] {
  return loadScores()
}

export function getDemoScoreById(id: string): DemoScore | undefined {
  return loadScores().find(s => s.id === id)
}
