import DateRangePicker from "@/components/chart-dashboard/components/DateRangePicker.tsx";
import {toStartOfDay, toEndOfDay} from "@/lib/date-utils.ts";
import LayoutModeSwitch from "@/components/chart-dashboard/components/LayoutModeSwitch.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import ChartLayout from "@/components/chart-dashboard/components/chart-layout/ChartLayout.tsx";
import {chartData, orderedChartDataDates} from "@/components/chart-dashboard/chart-data.ts";
import {useState, useEffect} from "react";
import type {DateRange} from "react-day-picker";

// Grid Library Imports
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import "./components/chart-layout/library-overrides.css"

// Types
export const LayoutMode = {
  Vertical: "Vertical",
  Compact: "Compact",
  Free: "Free",
} as const
export type LayoutMode = (typeof LayoutMode)[keyof typeof LayoutMode]

const DEFAULT_DATE_RANGE__MONTHS = 2
const SM_BREAKPOINT = 640 // TW xs|sm breakpoint

function ChartDashboard() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.Vertical)
  
  const today = new Date()
  const from = new Date(today)
  from.setMonth(today.getMonth() - DEFAULT_DATE_RANGE__MONTHS)

  // TODO: Possible that from is much less than the minimum avail minDate (below) — add a loud validation
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: toStartOfDay(from),
    to: toEndOfDay(today),
  })

  // TODO: Can be more efficient via media queries
  useEffect(() => {
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < SM_BREAKPOINT
      if (isSmallScreen) {
        setLayoutMode(LayoutMode.Vertical)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <Card className="w-full mt-4 p-1.5">
        <CardContent className='p-2.5 flex'>
          <div className="hidden sm:flex">
            <LayoutModeSwitch
              mode={layoutMode}
              updateMode={setLayoutMode}
            />
          </div>
          <DateRangePicker
            className='ml-0 sm:ml-auto'
            dateRange={dateRange}
            updateDateRange={setDateRange}
            minDate={orderedChartDataDates[0]}
            maxDate={orderedChartDataDates[orderedChartDataDates.length - 1]}
          />
        </CardContent>
      </Card>

      <ChartLayout
        charts={chartData}
        layoutMode={layoutMode}
        dateRange={dateRange}
        updateDateRange={setDateRange}
      />
    </>
  )
}

export default ChartDashboard
