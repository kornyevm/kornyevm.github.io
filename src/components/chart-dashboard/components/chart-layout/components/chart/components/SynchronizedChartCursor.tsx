import { useChartHover } from "@/components/chart-dashboard/components/chart-layout/context-providers/ChartHoverContext.tsx"
import { DateNib } from "./DateNib.tsx"

type SynchronizedChartCursorProps = {
  chartId: string,
  categoryColor: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  // TODO: Change type to unknown and add conditional type checks
  payload?: any,
}

export const SynchronizedChartCursor = (props: SynchronizedChartCursorProps) => {
  const { categoryColor, chartId, x = 0, y = 0, width = 0, height = 0, payload = null } = props
  const { activeChartId } = useChartHover() // Call before first return
  
  if (!width || !height) return null

  const shouldShowDateNibForChart = activeChartId === chartId
  
  const date: Date | null = payload?.[0]?.payload?.date instanceof Date ? payload?.[0]?.payload?.date : null
  const nibColor = categoryColor || "#0072DB"

  const centerX = x + width / 2
  const nibY = y + height - 2
  const labelY = nibY + 10 + 8 // nibHeight (10) + spacing (8)

  return (
    <g style={{pointerEvents: 'none'}}>
      {/* Cursor / highlight */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.18)"
        opacity={0.5}
        rx={8}
        ry={8}
      />
      {/* Date nib */}
      {date && shouldShowDateNibForChart && (
        <DateNib
          date={date}
          color={nibColor}
          variant="svg"
          centerX={centerX}
          nibY={nibY}
          labelY={labelY}
        />
      )}
    </g>
  )
}