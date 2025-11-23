import { DateNib } from "./DateNib.tsx"

type StartDateNibProps = {
  startIndex: number
  startDate: Date
  totalBars: number
  color: string
  containerWidth: number
  containerHeight: number
}

export const StartDateNib = ({
  startIndex,
  startDate,
  totalBars,
  color,
  containerWidth,
  containerHeight,
}: StartDateNibProps) => {
  if (totalBars === 0 || containerWidth === 0) return null

  const barWidth = containerWidth / totalBars
  const centerX = startIndex * barWidth + barWidth / 2

  return (
    <DateNib
      date={startDate}
      color={color}
      variant="html"
      containerCenterX={centerX}
      containerHeight={containerHeight}
    />
  )
}

