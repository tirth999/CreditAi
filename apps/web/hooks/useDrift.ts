import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"

export const useDriftLatest = () =>
  useQuery({
    queryKey: ["drift", "latest"],
    queryFn: () => api.get("/api/drift/latest").then((r) => r.data),
  })

export const useDriftHistory = (days = 30) =>
  useQuery({
    queryKey: ["drift", "history", days],
    queryFn: () => api.get(`/api/drift/history?days=${days}`).then((r) => r.data),
  })

export const useTriggerRetrain = () =>
  useMutation({
    mutationFn: () => api.post("/api/drift/retrain").then((r) => r.data),
  })
