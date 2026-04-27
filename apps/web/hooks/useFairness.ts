import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

export const useFairness = (scoreId: string) =>
  useQuery({
    queryKey: ["fairness", scoreId],
    queryFn: () => api.get(`/api/fairness/${scoreId}`).then((r) => r.data),
    enabled: !!scoreId,
  })

export const useFairnessAggregate = () =>
  useQuery({
    queryKey: ["fairness", "aggregate"],
    queryFn: () => api.get("/api/fairness/aggregate").then((r) => r.data),
  })
