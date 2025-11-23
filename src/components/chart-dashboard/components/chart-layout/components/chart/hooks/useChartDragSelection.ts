import { useState, useCallback, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { toStartOfDay, toEndOfDay } from "@/lib/date-utils.ts"
import type { Chart } from "@/components/chart-dashboard/chart.ts"
import type { DataPoint } from "@/components/chart-dashboard/chart.ts"

type UseChartDragSelectionProps = {
  filteredData: DataPoint[]
  chart: Chart
  updateDateRange: (dateRange: DateRange | undefined) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

// TODO: A ton of this is AI generated and needs review / cleanup.
/**
 * Hook for managing drag selection on charts
 * Handles click-and-drag date range selection with visual feedback
 */
export function useChartDragSelection({
  filteredData,
  chart,
  updateDateRange,
  containerRef,
}: UseChartDragSelectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startIndex, setStartIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [hasMoved, setHasMoved] = useState(false)

  // Calculate which bar index the mouse is over
  const calculateBarIndex = useCallback(
    (mouseX: number, containerWidth: number): number => {
      if (containerWidth === 0 || filteredData.length === 0) return 0
      const barWidth = containerWidth / filteredData.length
      const hoveredIndex = Math.floor(mouseX / barWidth)
      return Math.max(0, Math.min(filteredData.length - 1, hoveredIndex))
    },
    [filteredData.length]
  )

  // Handle bar click to start selection
  const handleBarClick = useCallback(
    (_data: any, _index: number, e?: any) => {
      e?.preventDefault?.()
      e?.stopPropagation?.()
    },
    []
  )

  // Handle mousedown on the chart area to start selection
  const handleChartMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return

      // Don't start drag if clicking on a button or other interactive element
      const target = e.target as HTMLElement
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("select")
      ) {
        return
      }

      // Calculate which bar we're over based on mouse position
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const chartWidth = rect.width
      const clampedIndex = calculateBarIndex(mouseX, chartWidth)

      setStartIndex(clampedIndex)
      setCurrentIndex(clampedIndex)
      setHasMoved(false)
      // Don't set isDragging yet - wait for mouse to actually move
      e.preventDefault() // Prevent text selection
    },
    [calculateBarIndex]
  )

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (startIndex === null || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const chartWidth = rect.width

      const clampedIndex = calculateBarIndex(mouseX, chartWidth)
      
      // Only start dragging if mouse has actually moved to a different bar
      if (!hasMoved && clampedIndex !== startIndex) {
        setHasMoved(true)
        setIsDragging(true)
      }
      
      if (isDragging || hasMoved) {
        setCurrentIndex(clampedIndex)
        e.preventDefault() // Prevent text selection during drag
      }
    },
    [isDragging, startIndex, hasMoved, calculateBarIndex]
  )

  // Handle mouse up to finalize selection
  const handleMouseUp = useCallback(() => {
    if (startIndex === null || currentIndex === null) {
      setIsDragging(false)
      setStartIndex(null)
      setCurrentIndex(null)
      setHasMoved(false)
      return
    }
    
    // If mouse never moved, just reset without updating date range
    if (!hasMoved || !isDragging) {
      setIsDragging(false)
      setStartIndex(null)
      setCurrentIndex(null)
      setHasMoved(false)
      return
    }

    // Determine the actual start and end indices (could be reversed if dragging left)
    const actualStartIndex = Math.min(startIndex, currentIndex)
    const actualEndIndex = Math.max(startIndex, currentIndex)

    // Get dates from filteredData
    const startDate = filteredData[actualStartIndex]?.date
    const endDate = filteredData[actualEndIndex]?.date

    if (startDate && endDate) {
      // Find the indices in the full dataset
      const fullStartIndex = chart.data.findIndex(
        (d) => d.date.getTime() === startDate.getTime()
      )
      const fullEndIndex = chart.data.findIndex(
        (d) => d.date.getTime() === endDate.getTime()
      )

      if (fullStartIndex >= 0 && fullEndIndex >= 0 && fullStartIndex !== fullEndIndex) {
        updateDateRange({
          from: toStartOfDay(chart.data[fullStartIndex].date),
          to: toEndOfDay(chart.data[fullEndIndex].date),
        })
      }
    }

    // Reset drag state
    setIsDragging(false)
    setStartIndex(null)
    setCurrentIndex(null)
    setHasMoved(false)
  }, [
    isDragging,
    startIndex,
    currentIndex,
    hasMoved,
    filteredData,
    chart.data,
    updateDateRange,
  ])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    // Mouse up will handle finalization
  }, [])

  // Clean up drag on unmount or when component updates
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      // Always call handleMouseUp if we have a startIndex (even if not dragging yet)
      if (startIndex !== null) {
        handleMouseUp()
      }
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (startIndex !== null && containerRef.current) {
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const chartWidth = rect.width

        const clampedIndex = calculateBarIndex(mouseX, chartWidth)
        
        // Only start dragging if mouse has actually moved to a different bar
        if (!hasMoved && clampedIndex !== startIndex) {
          setHasMoved(true)
          setIsDragging(true)
        }
        
        if (isDragging || hasMoved) {
          setCurrentIndex(clampedIndex)
        }
      }
    }

    // Listen for mouse events when startIndex is set (even if not dragging yet)
    // This allows us to detect when mouse moves and start dragging
    if (startIndex !== null) {
      window.addEventListener("mouseup", handleGlobalMouseUp)
      window.addEventListener("mousemove", handleGlobalMouseMove)
      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp)
        window.removeEventListener("mousemove", handleGlobalMouseMove)
      }
    }
  }, [isDragging, hasMoved, startIndex, handleMouseUp, calculateBarIndex])

  const startDate = startIndex !== null ? filteredData[startIndex]?.date : null

  return {
    isDragging,
    startIndex,
    currentIndex,
    startDate,
    handleBarClick,
    handleChartMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } as const
}

