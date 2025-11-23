type DateRangeOverlayProps = {
  startIndex: number
  endIndex: number
  totalBars: number
  color: string
  containerWidth: number
  containerHeight: number
}

const OVERLAY_PADDING_Y: number = 5

export const DateRangeOverlay = ({ 
  startIndex, 
  endIndex, 
  totalBars, 
  color,
  containerWidth,
  containerHeight
}: DateRangeOverlayProps) => {
  if (totalBars === 0 || containerWidth === 0) return null

  const barWidth = containerWidth / totalBars
  const startX = startIndex * barWidth
  const endX = (endIndex + 1) * barWidth
  const width = endX - startX

  return (
    <div
      style={{
        position: 'absolute',
        left: `${startX}px`,
        top: `-${OVERLAY_PADDING_Y}px`,
        width: `${width}px`,
        height: `${containerHeight + OVERLAY_PADDING_Y}px`,
        backgroundColor: color,
        opacity: 0.3,
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}

