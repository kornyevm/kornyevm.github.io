export const SynchronizedChartCursor = (props: {
  x: number,
  y: number,
  width: number,
  height: number,
}) => {
  const {x, y, width, height} = props
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(0, 0, 0, 0.18)"
      opacity={0.5}
      rx={8}
      ry={8}
      style={{pointerEvents: 'none'}}
    />
  )
}