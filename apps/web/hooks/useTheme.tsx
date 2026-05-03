"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    // Check localStorage first, then OS preference
    const stored = localStorage.getItem("creditai-theme") as Theme | null
    if (stored === "dark" || stored === "light") {
      setTheme(stored)
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light")
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("creditai-theme", theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
