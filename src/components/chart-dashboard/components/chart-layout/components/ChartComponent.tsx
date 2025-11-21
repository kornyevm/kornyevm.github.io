import type {Chart, DataPoint} from "@/components/chart-dashboard/chart.ts";
import {ChartContainer} from "@/components/ui/chart.tsx";
import { type ChartConfig } from "@/components/ui/chart"
import {Bar, BarChart, XAxis} from "recharts";
import DragHandle from "@/components/chart-dashboard/components/chart-layout/components/DragHandle.tsx";
import {useMemo, useState, useEffect} from "react";
import type {DateRange} from "react-day-picker";

type ChartProps = {
  chart: Chart,
  showDragHandle: boolean,
  dateRange: DateRange | undefined,
};

function ChartComponent({ chart, showDragHandle, dateRange }: ChartProps) {
  const chartConfig = {
    primaryValue: { color: "#0072DB", },
    secondaryValue: { color: "#34D399", },
    tertiaryValue: { color: "#F87171", }
  } satisfies ChartConfig

  // TODO: This is sorta inflexible — and should be communicated in the interface of the component.
  // TLDR: This component doesn't react to undefined / incomplete DateRanges
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

  const getDataValue = (data: DataPoint) => {
    return data.value
  }
  const getFillValue = (chart: Chart) => {
    switch (chart.category) {
      case "Primary":
        return `var(--color-primaryValue)`
      case "Secondary":
        return `var(--color-secondaryValue)`
      default:
        return `var(--color-tertiaryValue)`
    }
  }

  return (
    <>
      <div className="flex flex-col h-full pointer-events-auto relative z-0 no-drag" onMouseDown={(e) => e.stopPropagation()}>
        <ChartContainer id={chart.id} config={chartConfig} className='min-h-[40px] flex-1 w-full aspect-auto relative z-0'>
          <BarChart data={filteredData} compact={false}>
            {/*<XAxis*/}
            {/*  dataKey="date"*/}
            {/*  tickLine={false}*/}
            {/*  tickMargin={10}*/}
            {/*  axisLine={false}*/}
            {/*  tickFormatter={(date) => date.toLocaleDateString("en-GB")}*/}
            {/*/>*/}
            <Bar dataKey={getDataValue} fill={getFillValue(chart)} radius={5} />
            {/* <ChartTooltip content={<ChartTooltipContent labelKey='date' />} /> */}
          </BarChart>
        </ChartContainer>
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