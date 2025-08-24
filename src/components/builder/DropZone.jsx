"use client";

import { useDrop } from "react-dnd";

export default function DropZone({
  onDrop,
  position,
  parentId = null,
  isVisible = false,
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["COMPONENT", "CANVAS_COMPONENT"],
    drop: (item, monitor) => {
      // If dropped on this drop zone, call onDrop with the specific position
      if (item.type && !item.id) {
        // New component from library
        onDrop(item.type, position, parentId);
      } else if (item.id) {
        // Existing component being moved
        onDrop(item.id, position, parentId, true); // true indicates it's a move
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const showDropZone = isVisible || (isOver && canDrop);

  return (
    <div
      ref={drop}
      className={`transition-all duration-200 ${
        showDropZone
          ? "h-8 border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md mx-2 my-1 flex items-center justify-center"
          : "h-0 overflow-hidden"
      }`}>
      {showDropZone && (
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          Drop component here
        </span>
      )}
    </div>
  );
}
