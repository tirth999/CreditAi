import { create } from "zustand"

interface AuthState {
  userId: string | null
  role: string | null
  setUser: (id: string, role: string) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  setUser: (userId, role) => set({ userId, role }),
  clearUser: () => set({ userId: null, role: null }),
}))
