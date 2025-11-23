import { useMemo } from "react"

type UseDragOverlayProps = {
  isDragging: boolean
  startIndex: number | null
  currentIndex: number | null
  getCategoryColor: () => string
}

export function useDragOverlay({
  isDragging,
  startIndex,
  currentIndex,
  getCategoryColor,
}: UseDragOverlayProps) {
  const overlayRect = useMemo(() => {
    if (!isDragging || startIndex === null || currentIndex === null) return null

    const minIndex = Math.min(startIndex, currentIndex)
    const maxIndex = Math.max(startIndex, currentIndex)

    if (minIndex === maxIndex) return null

    return {
      startIndex: minIndex,
      endIndex: maxIndex,
      color: getCategoryColor(),
    }
  }, [isDragging, startIndex, currentIndex, getCategoryColor])

  return overlayRect
}
