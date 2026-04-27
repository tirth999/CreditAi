export interface User {
  id: string
  email: string
  full_name: string
  role: "user" | "admin"
  is_active: boolean
  created_at: string
}

export interface ApplicationPayload {
  payment_history_pct: number
  amounts_owed: number
  credit_utilization_ratio: number
  credit_length_months: number
  new_inquiries_6m: number
  credit_mix_count: number
  annual_income: number
  employment_status: string
  zip_code: string
  age: number
  has_alt_data?: boolean
  mobile_usage_score?: number
  utility_payment_ratio?: number
  rental_history_months?: number
  digital_payment_frequency?: number
  financial_narrative_text?: string
  demographic_consented?: boolean
  gender?: string
  ethnicity?: string
}

export interface ShapValue {
  feature_name: string
  feature_value: number | null
  shap_value: number
  rank: number
  direction: "positive" | "negative"
}

export interface AdverseActionReason {
  code: string
  plain_text: string
  regulatory_text?: string
  feature_value?: number
  shap_value: number
}

export interface AdverseAction {
  required: boolean
  reasons: AdverseActionReason[]
  notice_text: string
  credit_report_rights: string
  applicant_rights: string
}

export interface FairnessReport {
  id: string
  score_id: string
  model_version: string
  demographic_parity_diff: number | null
  equalized_odds_diff: number | null
  disparate_impact_ratio: number | null
  statistical_parity_diff: number | null
  equal_opportunity_diff: number | null
  flags: Record<string, boolean>
  passed_regulatory_threshold: boolean
  created_at: string
}

export interface ScoreResponse {
  id: string
  application_id: string
  model_version: string
  score: number
  probability_of_default: number
  risk_tier: "Low" | "Medium-Low" | "Medium-High" | "High"
  confidence_lower: number | null
  confidence_upper: number | null
  used_alt_data: boolean
  used_nlp: boolean
  computation_ms: number | null
  created_at: string
  shap_values: ShapValue[]
  fairness: FairnessReport | null
  adverse_action: AdverseAction | null
}

export interface ScoreJobStatus {
  status: "pending" | "processing" | "completed" | "failed"
  score_id?: string
  error?: string
}

export interface DriftReport {
  id: string
  model_version: string
  report_date: string
  psi_scores: Record<string, number>
  ks_results: Record<string, { statistic: number; p_value: number }>
  drift_detected: boolean
  features_drifted: string[]
  auc_at_report: number | null
  retrain_triggered: boolean
}

export interface ModelRegistry {
  id: string
  version: string
  algorithm: string
  dataset: string
  auc_roc: number
  f1_score: number
  gini_coefficient: number
  accuracy: number
  train_date: string
  is_active: boolean
  artifact_path: string
  parameters: Record<string, unknown>
  fairness_baseline: Record<string, number>
  training_samples: number | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}
