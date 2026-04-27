import { Badge } from "@/components/ui/badge"

interface Props {
  tier: string
}

const MAP: Record<string, string> = {
  "Low":         "bg-green-500/20 text-green-400 border-green-500/30",
  "Medium-Low":  "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "Medium-High": "bg-gold-400/20 text-gold-400 border-gold-400/30",
  "High":        "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function RiskTierBadge({ tier }: Props) {
  return (
    <Badge variant="outline" className={MAP[tier] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
      {tier} Risk
    </Badge>
  )
}
