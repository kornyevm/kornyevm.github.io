import type {Chart} from "@/components/chart-dashboard/chart.ts"
import ChartComponent from "@/components/chart-dashboard/components/chart-layout/components/ChartComponent"
import GridLayout, { type Layout } from "react-grid-layout"
import {LayoutMode} from "@/components/chart-dashboard/ChartDashboard.tsx"
import {useEffect, useRef, useState, useCallback} from "react"
import ResizeHandle from "@/components/chart-dashboard/components/chart-layout/components/ResizeHandle.tsx";
import type {DateRange} from "react-day-picker";

type ChartLayoutProps = {
  charts: Chart[]
  layoutMode: LayoutMode
  dateRange: DateRange | undefined
}

const CHART_HEIGHT = 2
const ROW_HEIGHT_PX = 30
const FREE_MODE_COLS = 12
const LOCAL_STORAGE_KEY = "chart-dashboard-free-layout"

function ChartDashboard({ charts, layoutMode, dateRange }: ChartLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(1000)

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setWidth(container.offsetWidth);
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width)
      }
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const persistFreeLayoutChange = useCallback((newLayout: Layout[]) => {
    if (layoutMode !== LayoutMode.Free) return

    // TODO: If this layout is already cached, skip
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLayout))
    } catch (error) {
      console.error("Could not save layout to Local Storage:", error)
    }
  }, [layoutMode])

  let layout: Layout[]
  let numGridCols: number

  switch (layoutMode) {
    case LayoutMode.Vertical:
      numGridCols = 1
      layout = charts.map((chart, i) => ({
        i: chart.id,
        x: 0, y: i,
        w: numGridCols, h: CHART_HEIGHT,
        isDraggable: false,
        isResizable: false
      }))
      break
    case LayoutMode.Compact:
      numGridCols = 3
      layout = charts.map((chart, i) => ({
        i: chart.id,
        x: i % numGridCols, y: Math.floor(i/numGridCols),
        w: 1, h: CHART_HEIGHT,
        isDraggable: false,
        isResizable: false
      }))
      break
    default: // Free mode
      numGridCols = FREE_MODE_COLS
      
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        // TODO: Handle errors + show feedback
        layout = JSON.parse(saved)
      } else {
        layout = charts.map((chart, i) => ({
          i: chart.id,
          x: 0,
          y: i,
          w: FREE_MODE_COLS,
          h: CHART_HEIGHT,
          minW: 2,
          maxW: FREE_MODE_COLS,
          minH: 2,
          maxH: 7,
          isDraggable: true,
          isResizable: true,
        }))
      }
      break
  }

  return (
    <div ref={containerRef} className="w-full">
      <GridLayout
        layout={layout}
        cols={numGridCols}
        rowHeight={ROW_HEIGHT_PX}
        width={width}
        margin={[10, 45]}
        isBounded={true}
        draggableHandle=".drag-chart-handle"
        resizeHandle={(axis, ref) => <ResizeHandle handleAxis={axis} ref={ref} />}
        onLayoutChange={persistFreeLayoutChange}
      >
        {
          charts.map((chart) => (
            <div key={chart.id} className="h-full relative">
              <ChartComponent 
                chart={chart} 
                showDragHandle={layoutMode === LayoutMode.Free}
                dateRange={dateRange}
              />
            </div>
          ))
        }
      </GridLayout>
    </div>
  )
}

export default ChartDashboard