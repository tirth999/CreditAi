import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export const useScores = () =>
  useQuery({
    queryKey: ["scores"],
    queryFn: () => api.get("/api/scores").then((r) => r.data),
  })

export const useScore = (id: string) =>
  useQuery({
    queryKey: ["score", id],
    queryFn: () => api.get(`/api/score/${id}`).then((r) => r.data),
    enabled: !!id,
  })

export const useSubmitApplication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post("/api/score", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scores"] }),
  })
}
