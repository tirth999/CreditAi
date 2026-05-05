import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const applicationSchema = z.object({
  payment_history_pct: z.number().min(0).max(100),
  amounts_owed: z.number().min(0),
  credit_utilization_pct: z.number().min(0).max(100),
  credit_length_months: z.number().int().min(0),
  new_inquiries_6m: z.number().int().min(0).max(50),
  credit_mix_count: z.number().int().min(0).max(20),
  annual_income: z.number().min(0),
  employment_status: z.enum(["employed", "self-employed", "unemployed", "retired", "student"]),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code"),
  age: z.number().int().min(18).max(120),
  mobile_usage_score: z.number().min(0).max(100).optional(),
  utility_payment_ratio: z.number().min(0).max(100).optional(),
  rental_history_months: z.number().int().min(0).optional(),
  digital_payment_frequency: z.number().min(0).optional(),
  financial_narrative: z.string().max(2000).optional(),
  gender: z.string().optional(),
  age_group: z.string().optional(),
  region_type: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
