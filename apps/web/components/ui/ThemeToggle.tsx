"use client"

import { useTheme } from "@/hooks/useTheme"

/**
 * Theme toggle — 44×24px pill with D/L labels
 * Sliding 20px square (not circle), snaps (step transition)
 * Space Mono 10px
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        width: 44,
        height: 24,
        padding: 0,
        border: "1px solid var(--border)",
        borderRadius: 0,
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Sliding square indicator */}
      <div
        style={{
          position: "absolute",
          left: isDark ? 1 : 21,
          top: 1,
          width: 20,
          height: 20,
          background: "var(--accent)",
          transition: "left 0s", // Snap, no smooth slide
        }}
      />

      {/* D label */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: 22,
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          color: isDark ? "var(--bg-void)" : "var(--text-tertiary)",
          lineHeight: "22px",
          userSelect: "none",
        }}
      >
        D
      </span>

      {/* L label */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: 22,
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          color: isDark ? "var(--text-tertiary)" : "var(--bg-void)",
          lineHeight: "22px",
          userSelect: "none",
        }}
      >
        L
      </span>
    </button>
  )
}
