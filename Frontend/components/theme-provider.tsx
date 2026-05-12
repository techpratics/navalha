'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme as useNextTheme,
} from 'next-themes'

export type SidebarColor = "charcoal" | "blue" | "green" | "purple" | "red" | "amber"

interface SidebarColorContextType {
  sidebarColor: SidebarColor
  setSidebarColor: (color: SidebarColor) => void
}

const SidebarColorContext = React.createContext<SidebarColorContextType | undefined>(undefined)

export const sidebarColors: Record<SidebarColor, { label: string; bg: string; primary: string; accent: string; border: string }> = {
  charcoal: { 
    label: "Carvão", 
    bg: "oklch(0.18 0.02 60)",
    primary: "oklch(0.75 0.15 75)",
    accent: "oklch(0.25 0.02 60)",
    border: "oklch(0.28 0.02 60)"
  },
  blue: { 
    label: "Azul", 
    bg: "oklch(0.22 0.06 250)",
    primary: "oklch(0.70 0.15 250)",
    accent: "oklch(0.28 0.06 250)",
    border: "oklch(0.32 0.06 250)"
  },
  green: { 
    label: "Verde", 
    bg: "oklch(0.22 0.06 160)",
    primary: "oklch(0.70 0.18 160)",
    accent: "oklch(0.28 0.06 160)",
    border: "oklch(0.32 0.06 160)"
  },
  purple: { 
    label: "Roxo", 
    bg: "oklch(0.22 0.06 300)",
    primary: "oklch(0.70 0.18 300)",
    accent: "oklch(0.28 0.06 300)",
    border: "oklch(0.32 0.06 300)"
  },
  red: { 
    label: "Vermelho", 
    bg: "oklch(0.22 0.06 25)",
    primary: "oklch(0.70 0.18 25)",
    accent: "oklch(0.28 0.06 25)",
    border: "oklch(0.32 0.06 25)"
  },
  amber: { 
    label: "Âmbar", 
    bg: "oklch(0.22 0.06 85)",
    primary: "oklch(0.75 0.18 85)",
    accent: "oklch(0.28 0.06 85)",
    border: "oklch(0.32 0.06 85)"
  },
}

function SidebarColorProvider({ children }: { children: React.ReactNode }) {
  const [sidebarColor, setSidebarColorState] = React.useState<SidebarColor>("charcoal")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("sidebarColor") as SidebarColor
    if (stored && sidebarColors[stored]) {
      setSidebarColorState(stored)
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    const colors = sidebarColors[sidebarColor]

    root.style.setProperty("--sidebar", colors.bg)
    root.style.setProperty("--sidebar-foreground", "oklch(0.95 0 0)")
    root.style.setProperty("--sidebar-primary", colors.primary)
    root.style.setProperty("--sidebar-primary-foreground", "oklch(0.15 0 0)")
    root.style.setProperty("--sidebar-accent", colors.accent)
    root.style.setProperty("--sidebar-accent-foreground", "oklch(0.95 0 0)")
    root.style.setProperty("--sidebar-border", colors.border)
    root.style.setProperty("--sidebar-ring", colors.primary)
    
    localStorage.setItem("sidebarColor", sidebarColor)
  }, [sidebarColor, mounted])

  const setSidebarColor = React.useCallback((color: SidebarColor) => {
    setSidebarColorState(color)
  }, [])

  return (
    <SidebarColorContext.Provider value={{ sidebarColor, setSidebarColor }}>
      {children}
    </SidebarColorContext.Provider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SidebarColorProvider>
        {children}
      </SidebarColorProvider>
    </NextThemesProvider>
  )
}

export function useSidebarColor() {
  const context = React.useContext(SidebarColorContext)
  if (context === undefined) {
    throw new Error("useSidebarColor must be used within a ThemeProvider")
  }
  return context
}

export { useNextTheme as useTheme }
