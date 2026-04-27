import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  if (score >= 800) return "Exceptional"
  if (score >= 740) return "Very Good"
  if (score >= 670) return "Good"
  if (score >= 580) return "Fair"
  return "Poor"
}

export function scoreToColor(score: number): string {
  if (score >= 740) return "#22c55e"
  if (score >= 670) return "#14b8a6"
  if (score >= 580) return "#d4a84b"
  return "#ef4444"
}

export function riskTierColor(tier: string): string {
  const map: Record<string, string> = {
    Low: "bg-green-500/20 text-green-400",
    "Medium-Low": "bg-teal-500/20 text-teal-400",
    "Medium-High": "bg-yellow-500/20 text-yellow-400",
    High: "bg-red-500/20 text-red-400",
  }
  return map[tier] ?? "bg-gray-500/20 text-gray-400"
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}
