import type {Chart} from "@/components/chart-dashboard/chart.ts";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart.tsx";
import {Bar, BarChart} from "recharts";
import DragHandle from "@/components/chart-dashboard/components/chart-layout/components/DragHandle.tsx";
import type {DateRange} from "react-day-picker";
import {DateRangeOverlay} from "@/components/chart-dashboard/components/chart-layout/components/DateRangeOverlay.tsx";
import {useValidatedDateRangeFilteredData} from "@/components/chart-dashboard/components/chart-layout/hooks/useValidatedDateRangeFilteredData.ts";
import {useContainerDimensions} from "@/components/chart-dashboard/components/chart-layout/hooks/useContainerDimensions.ts";
import {useChartDragSelection} from "@/components/chart-dashboard/components/chart-layout/hooks/useChartDragSelection.ts";
import {useChartConfig} from "@/components/chart-dashboard/components/chart-layout/hooks/useChartConfig.ts";
import {useDragOverlay} from "@/components/chart-dashboard/components/chart-layout/hooks/useDragOverlay.ts";
import {
  SynchronizedChartCursor
} from "@/components/chart-dashboard/components/chart-layout/components/SynchronizedChartCursor.tsx";

type ChartProps = {
  chart: Chart,
  showDragHandle: boolean,
  dateRange: DateRange | undefined,
  updateDateRange: (dateRange: DateRange | undefined) => void,
};

function ChartComponent({ chart, showDragHandle, dateRange, updateDateRange }: ChartProps) {
  // TODO: The chart date filter is sorta inflexible — and should be communicated in the interface of the component.
  // TLDR: This component doesn't react to undefined / incomplete DateRanges
  const { filteredData } = useValidatedDateRangeFilteredData(chart, dateRange)
  const { containerRef, dimensions } = useContainerDimensions()
  const { chartConfig, getCategoryColor, getFillValue } = useChartConfig(chart)

  const {
    isDragging,
    startIndex,
    currentIndex,
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
          onMouseLeave={handleMouseLeave}
          className={`relative w-full flex-1 min-h-0 overflow-hidden ${isDragging ? 'chart-dragging' : ''}`}
          style={{ cursor: isDragging ? 'ew-resize' : 'pointer' }}
        >
          <ChartContainer 
            id={chart.id} 
            config={chartConfig} 
            className='min-h-[40px] w-full h-full'
          >
            <BarChart data={filteredData} syncId="chart-dashboard-sync">
              {/*<XAxis*/}
              {/*  dataKey="date"*/}
              {/*  tickLine={false}*/}
              {/*  tickMargin={10}*/}
              {/*  axisLine={false}*/}
              {/*  tickFormatter={(date) => date.toLocaleDateString("en-GB")}*/}
              {/*/>*/}
              <Bar 
                dataKey="value" 
                fill={getFillValue()} 
                radius={5}
                onClick={handleBarClick}
                style={{ cursor: 'pointer' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent labelKey='date' />}
                cursor={<SynchronizedChartCursor />}
              />
            </BarChart>
          </ChartContainer>
          {/* Custom overlay rectangle for drag selection */}
          {overlayRect && dimensions.width > 0 && (
            <DateRangeOverlay
              startIndex={overlayRect.startIndex}
              endIndex={overlayRect.endIndex}
              totalBars={filteredData.length}
              color={overlayRect.color}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height}
            />
          )}
        </div>
      </div>
      <div>
        <div className='mt-2 flex-shrink-0'>
          <div className='text-sm ml-1'>{chart.label}</div>

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