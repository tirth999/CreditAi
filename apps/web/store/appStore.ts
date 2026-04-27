import { create } from "zustand"

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeModelVersion: string | null
  setActiveModelVersion: (v: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  activeModelVersion: null,
  setActiveModelVersion: (activeModelVersion) => set({ activeModelVersion }),
}))
