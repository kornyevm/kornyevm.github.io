import { ArrowDownRight } from "lucide-react"
import React, { forwardRef } from "react"

type ResizeHandleProps = {
  handleAxis: string
  className?: string
};

// TODO: This component could use a refactor. See className
const ResizeHandle = forwardRef<HTMLElement, ResizeHandleProps>(
  ({ handleAxis, className = "", ...props }, ref) => {
    const axisClass = `react-resizable-handle-${handleAxis}`

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        {...props}
        className={`
          react-resizable-handle
          ${axisClass}
          ${className}
          absolute bottom-3! right-1
          flex items-center justify-center
          w-5 h-5
          bg-white border border-gray-400 rounded
          shadow cursor-se-resize
          bg-red-500
          z-50 pointer-events-auto
        `}
      >
        <ArrowDownRight size={12} />
      </div>
    )
  }
)

ResizeHandle.displayName = "ResizeHandle";

export default ResizeHandle
