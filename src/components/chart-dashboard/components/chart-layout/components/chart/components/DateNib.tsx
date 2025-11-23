type DateNibProps = {
  date: Date
  color: string
  variant: 'svg' | 'html'
  centerX?: number // For SVG positioning
  nibY?: number // For SVG positioning
  labelY?: number // For SVG positioning
  containerCenterX?: number // For HTML positioning
  containerHeight?: number // For HTML positioning
}

const NIB_WIDTH = 3
const NIB_HEIGHT = 10
const LABEL_SPACING = 8 // Match SVG spacing
const NIB_OFFSET_FROM_BOTTOM = 2 // Match SVG offset (nibY = y + height - 2)
const FONT_SIZE = 12 // 0.75rem = 12px
// SVG text y positions the baseline, HTML div top positions the top edge
// Baseline is typically ~80% down from top for most fonts
const BASELINE_OFFSET = FONT_SIZE * 0.8 // Approximate baseline offset from top

/**
 * TODO: A lot of this is AI generated — needs some refactoring.
 * - Also, add a validation for the presence of the correct prop groups
 */
export const DateNib = ({
  date,
  color,
  variant,
  centerX = 0,
  nibY = 0,
  labelY = 0,
  containerCenterX = 0,
  containerHeight = 0,
}: DateNibProps) => {
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  if (variant === 'svg') {
    return (
      <>
        <rect
          x={centerX - NIB_WIDTH / 2}
          y={nibY}
          width={NIB_WIDTH}
          height={NIB_HEIGHT}
          fill={color}
          rx={1.5}
          ry={1.5}
        />
        <text
          x={centerX}
          y={labelY}
          textAnchor="middle"
          className="text-xs fill-foreground"
          style={{ 
            fontSize: '0.75rem',
            pointerEvents: 'none',
          }}
        >
          {formattedDate}
        </text>
      </>
    )
  }

  // HTML variant - position to match SVG nib exactly
  // SVG: nibY = y + height - 2, labelY = nibY + NIB_HEIGHT + LABEL_SPACING
  // SVG text y positions the baseline, so baseline is at: containerHeight - 2 + NIB_HEIGHT + LABEL_SPACING
  // For HTML, we need to position the top of the div such that the baseline aligns
  const nibTop = containerHeight - NIB_OFFSET_FROM_BOTTOM
  // Calculate where the SVG baseline would be
  const svgBaselineY = nibTop + NIB_HEIGHT + LABEL_SPACING
  // Position HTML label top so its baseline aligns with SVG baseline
  const labelTop = svgBaselineY - BASELINE_OFFSET
  
  return (
    <div
      style={{
        position: 'absolute',
        left: `${containerCenterX}px`,
        top: `${nibTop}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Small colored rounded rectangle nib */}
      <div
        style={{
          width: `${NIB_WIDTH}px`,
          height: `${NIB_HEIGHT}px`,
          backgroundColor: color,
          borderRadius: '1.5px',
          margin: '0 auto',
        }}
      />
      {/* Date text below the nib - position to match SVG baseline exactly */}
      <div
        className="text-xs text-foreground whitespace-nowrap"
        style={{
          position: 'absolute',
          top: `${labelTop - nibTop}px`, // Relative to nib container
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.75rem',
          lineHeight: '1',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {formattedDate}
      </div>
    </div>
  )
}

