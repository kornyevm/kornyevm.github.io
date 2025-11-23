import type {Chart} from "@/components/chart-dashboard/chart.ts"
import ChartComponent from "@/components/chart-dashboard/components/chart-layout/components/chart/ChartComponent.tsx"
import GridLayout, { type Layout } from "react-grid-layout"
import {LayoutMode} from "@/components/chart-dashboard/ChartDashboard.tsx"
import {useCallback, useState, useEffect, useMemo} from "react"
import ResizeHandle from "@/components/chart-dashboard/components/chart-layout/components/ResizeHandle.tsx";
import type {DateRange} from "react-day-picker";
import {ChartHoverProvider} from "@/components/chart-dashboard/components/chart-layout/context-providers/ChartHoverContext.tsx";
import {useContainerDimensions} from "@/components/chart-dashboard/components/chart-layout/components/chart/hooks/useContainerDimensions.ts";

type ChartLayoutProps = {
  charts: Chart[]
  layoutMode: LayoutMode
  dateRange: DateRange | undefined
  updateDateRange: (dateRange: DateRange | undefined) => void
}

const CHART_HEIGHT = 2
const ROW_HEIGHT_PX = 30
const FREE_MODE_COLS = 12
const LOCAL_STORAGE_KEY = "chart-dashboard-free-layout"

function ChartDashboard({ charts, layoutMode, dateRange, updateDateRange }: ChartLayoutProps) {
  const { containerRef, dimensions } = useContainerDimensions()
  const width = dimensions.width || 1000

  const computeInitialLayout = useCallback((mode: LayoutMode, chartList: Chart[]): Layout[] => {
    switch (mode) {
      case LayoutMode.Vertical:
        return chartList.map((chart, i) => ({
          i: chart.id,
          x: 0, y: i,
          w: 1, h: CHART_HEIGHT,
          isDraggable: false,
          isResizable: false
        }))
      case LayoutMode.Compact:
        const cols = 3
        return chartList.map((chart, i) => ({
          i: chart.id,
          x: i % cols, y: Math.floor(i/cols),
          w: 1, h: CHART_HEIGHT,
          isDraggable: false,
          isResizable: false
        }))
      default:
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (saved) {
          try {
            const savedLayout: Layout[] = JSON.parse(saved)
            const chartIds = new Set(chartList.map(c => c.id))
            const validatedLayout = savedLayout
              .filter(item => chartIds.has(item.i))
              .map(item => ({
                ...item,
                minW: 2,
                maxW: FREE_MODE_COLS,
                minH: 2,
                maxH: 7,
                isDraggable: true,
                isResizable: true,
              }))
            const savedIds = new Set(savedLayout.map(item => item.i))
            const newCharts = chartList
              .filter(chart => !savedIds.has(chart.id))
              .map((chart, i) => ({
                i: chart.id,
                x: 0,
                y: validatedLayout.length + i,
                w: FREE_MODE_COLS,
                h: CHART_HEIGHT,
                minW: 2,
                maxW: FREE_MODE_COLS,
                minH: 2,
                maxH: 7,
                isDraggable: true,
                isResizable: true,
              }))
            return [...validatedLayout, ...newCharts]
          } catch (error) {
            console.error("Could not parse saved layout:", error)
          }
        }
        return chartList.map((chart, i) => ({
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
  }, [])

  const [layout, setLayout] = useState<Layout[]>(() => computeInitialLayout(layoutMode, charts))
  useEffect(() => {
    setLayout(computeInitialLayout(layoutMode, charts))
  }, [layoutMode, charts, computeInitialLayout])

  const numGridCols = useMemo(() => {
    switch (layoutMode) {
      case LayoutMode.Vertical:
        return 1
      case LayoutMode.Compact:
        return 3
      default:
        return FREE_MODE_COLS
    }
  }, [layoutMode])

  const persistFreeLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout)
    
    if (layoutMode === LayoutMode.Free) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLayout))
      } catch (error) {
        console.error("Could not save layout to Local Storage:", error)
      }
    }
  }, [layoutMode])

  return (
    <ChartHoverProvider>
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
                  updateDateRange={updateDateRange}
                />
              </div>
            ))
          }
        </GridLayout>
      </div>
    </ChartHoverProvider>
  )
}

export default ChartDashboard