import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export const useModels = () =>
  useQuery({
    queryKey: ["models"],
    queryFn: () => api.get("/api/models").then((r) => {
      const d = r.data
      return Array.isArray(d) ? d : d?.models ?? d?.items ?? []
    }),
  })

export const useModel = (id: string) =>
  useQuery({
    queryKey: ["model", id],
    queryFn: () => api.get(`/api/models/${id}`).then((r) => r.data),
    enabled: !!id,
  })

export const usePromoteModel = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/models/${id}/promote`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["models"] }),
  })
}
