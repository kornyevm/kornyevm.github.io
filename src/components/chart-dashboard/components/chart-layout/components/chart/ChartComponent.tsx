import type {Chart} from "@/components/chart-dashboard/chart.ts";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart.tsx";
import {Bar, BarChart} from "recharts";
import DragHandle from "@/components/chart-dashboard/components/chart-layout/components/chart/components/DragHandle.tsx";
import type {DateRange} from "react-day-picker";
import {DateRangeOverlay} from "@/components/chart-dashboard/components/chart-layout/components/chart/components/DateRangeOverlay.tsx";
import {StartDateNib} from "@/components/chart-dashboard/components/chart-layout/components/chart/components/StartDateNib.tsx";
import {useValidatedDateRangeFilteredData} from "@/components/chart-dashboard/components/chart-layout/components/chart/hooks/useValidatedDateRangeFilteredData.ts";
import {useContainerDimensions} from "@/components/chart-dashboard/components/chart-layout/components/chart/hooks/useContainerDimensions.ts";
import {useChartDragSelection} from "@/components/chart-dashboard/components/chart-layout/components/chart/hooks/useChartDragSelection.ts";
import {useChartConfig} from "@/components/chart-dashboard/components/chart-layout/components/chart/hooks/useChartConfig.ts";
import {useDragOverlay} from "@/components/chart-dashboard/components/chart-layout/components/chart/hooks/useDragOverlay.ts";
import {useChartHover} from "@/components/chart-dashboard/components/chart-layout/context-providers/ChartHoverContext.tsx";
import {
  SynchronizedChartCursor
} from "@/components/chart-dashboard/components/chart-layout/components/chart/components/SynchronizedChartCursor.tsx";

type ChartProps = {
  chart: Chart,
  showDragHandle: boolean,
  dateRange: DateRange | undefined,
  updateDateRange: (dateRange: DateRange | undefined) => void,
}

const DATE_NIB_MARGIN = 25

function ChartComponent({ chart, showDragHandle, dateRange, updateDateRange }: ChartProps) {
  // TODO: The chart date filter is sorta inflexible — and should be communicated in the interface of the component.
  // TLDR: This component doesn't react to undefined / incomplete DateRanges
  const { filteredData } = useValidatedDateRangeFilteredData(chart, dateRange)
  const { containerRef, dimensions } = useContainerDimensions()
  const { chartConfig, getCategoryColor, getFillValue } = useChartConfig(chart)
  const { setActiveChartId } = useChartHover()

  const {
    isDragging,
    startIndex,
    currentIndex,
    startDate,
    handleBarClick,
    handleChartMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useChartDragSelection({
    filteredData,
    chart,
    updateDateRange,
    containerRef,
  })

  const overlayRect = useDragOverlay({
    isDragging,
    startIndex,
    currentIndex,
    getCategoryColor,
  })

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <div
          ref={containerRef}
          onMouseDown={handleChartMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseLeave()
            setActiveChartId(null)
          }}
          onMouseEnter={() => setActiveChartId(chart.id)}
          className={`relative w-full flex-1 min-h-0 ${isDragging ? 'chart-dragging overflow-visible' : 'overflow-hidden'}`}
          style={{ cursor: isDragging ? 'ew-resize' : 'pointer' }}
        >
          <ChartContainer 
            id={chart.id} 
            config={chartConfig} 
            className='min-h-[40px] w-full h-full'
          >
            <BarChart 
              data={filteredData} 
              syncId="chart-dashboard-sync"
              margin={{ bottom: DATE_NIB_MARGIN }}
            >
              <Bar 
                dataKey="value" 
                fill={getFillValue()} 
                radius={5}
                onClick={handleBarClick}
                style={{ cursor: 'pointer' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent labelKey='date' />}
                cursor={<SynchronizedChartCursor categoryColor={getCategoryColor()} chartId={chart.id} />}
              />
            </BarChart>
          </ChartContainer>

          {overlayRect && dimensions.width > 0 && (
            <DateRangeOverlay
              startIndex={overlayRect.startIndex}
              endIndex={overlayRect.endIndex}
              totalBars={filteredData.length}
              color={overlayRect.color}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height - DATE_NIB_MARGIN}
            />
          )}
          {isDragging && startIndex !== null && startDate && dimensions.width > 0 && (
            <StartDateNib
              startIndex={startIndex}
              startDate={startDate}
              totalBars={filteredData.length}
              color={getCategoryColor()}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height - DATE_NIB_MARGIN}
            />
          )}
        </div>
      </div>
      <div>
        <div className='flex-shrink-0'>
          <div className='-mt-2 text-sm ml-1'>{chart.label}</div>

          { showDragHandle && <DragHandle /> }

          {/*TODO: Come back & improve styling*/}
          {/*<ButtonGroup className='ml-auto'>*/}
          {/*  <Button size='sm' variant='destructive'>{chart.data[0].date.toLocaleDateString()}</Button>*/}
          {/*  <Button size='sm' disabled={true} variant='outline'>{chart.data.length}</Button>*/}
          {/*</ButtonGroup>*/}
        </div>
      </div>
    </>
)
}

export default ChartComponent