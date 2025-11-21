import { useMemo, useCallback } from "react"
import type { ChartConfig } from "@/components/ui/chart"
import type { Chart } from "@/components/chart-dashboard/chart.ts"


export function useChartConfig(chart: Chart) {
  const chartConfig = useMemo<ChartConfig>(
    () => ({
      primaryValue: { color: "#0072DB" },
      secondaryValue: { color: "#34D399" },
      tertiaryValue: { color: "#F87171" },
    }),
    []
  )

  const getCategoryColor = useCallback(() => {
    switch (chart.category) {
      case "Primary":
        return "#0072DB"
      case "Secondary":
        return "#34D399"
      default:
        return "#F87171"
    }
  }, [chart.category])

  const getFillValue = useCallback(() => {
    switch (chart.category) {
      case "Primary":
        return `var(--color-primaryValue)`
      case "Secondary":
        return `var(--color-secondaryValue)`
      default:
        return `var(--color-tertiaryValue)`
    }
  }, [chart.category])

  return {
    chartConfig,
    getCategoryColor,
    getFillValue,
  }
}
