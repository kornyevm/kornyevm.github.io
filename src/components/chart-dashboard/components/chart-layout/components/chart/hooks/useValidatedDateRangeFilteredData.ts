import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import type { Chart } from "@/components/chart-dashboard/chart.ts"


export function useValidatedDateRangeFilteredData(chart: Chart, dateRange: DateRange | undefined) {
  const [lastValidDateRange, setLastValidDateRange] = useState<DateRange | undefined>(
    dateRange?.from && dateRange?.to ? dateRange : undefined
  )

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setLastValidDateRange(dateRange)
    }
  }, [dateRange])

  const filteredData = useMemo(() => {
    if (!lastValidDateRange?.from || !lastValidDateRange?.to) {
      return chart.data
    }

    const { from, to } = lastValidDateRange

    return chart.data.filter((dataPoint) => {
      return from <= dataPoint.date && dataPoint.date <= to
    })
  }, [chart.data, lastValidDateRange])

  return { filteredData, lastValidDateRange }
}

