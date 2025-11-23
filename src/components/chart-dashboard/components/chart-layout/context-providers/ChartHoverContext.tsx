import { createContext, useContext, useState, type ReactNode } from "react"

type ChartHoverContextType = {
  activeChartId: string | null
  setActiveChartId: (chartId: string | null) => void
}

const ChartHoverContext = createContext<ChartHoverContextType | undefined>(undefined)

export function ChartHoverProvider({ children }: { children: ReactNode }) {
  const [activeChartId, setActiveChartId] = useState<string | null>(null)

  return (
    <ChartHoverContext.Provider value={{ activeChartId, setActiveChartId }}>
      {children}
    </ChartHoverContext.Provider>
  )
}

export function useChartHover() {
  const context = useContext(ChartHoverContext)
  if (context === undefined) {
    throw new Error("useChartHover must be used within a ChartHoverProvider")
  }
  return context
}

