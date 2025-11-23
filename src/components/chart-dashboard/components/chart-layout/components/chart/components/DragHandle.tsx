import {GripVertical} from "lucide-react";

// TODO: Double check whether we need the z-index and pointer events classes
export default function DragHandle() {
  return (
    <div
      className="
        drag-chart-handle
        absolute bottom-0 right-6
        flex items-center justify-center
        w-5 h-5
        bg-white border border-gray-400 rounded
        shadow cursor-move
        z-50 pointer-events-auto
      "
    >
      <GripVertical size={12} />
    </div>
  );
}
