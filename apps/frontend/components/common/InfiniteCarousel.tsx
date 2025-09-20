"use client";

import { ReactNode } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

interface InfiniteCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getId: (item: T) => string | number;
  onReorder?: (items: T[]) => void;
}

export default function InfiniteCarousel<T>({
  items,
  renderItem,
  getId,
  onReorder,
}: Readonly<InfiniteCarouselProps<T>>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorder?.(reordered);
  };

  return (
    <div className="relative w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="carousel" direction="horizontal">
          {(provided) => (
            <div
              className="overflow-x-auto scrollbar-hide"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex gap-4 p-2 items-start">
                {items.map((item, index) => (
                  <Draggable
                    key={String(getId(item))}
                    draggableId={String(getId(item))}
                    index={index}
                  >
                    {(draggableProvided, snapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        className={`flex-shrink-0 relative ${snapshot.isDragging ? "z-50" : ""}`}
                      >
                        {/* explicit drag handle — use this to start dragging */}
                        <button
                          {...draggableProvided.dragHandleProps}
                          aria-label="Drag handle"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -top-2 -right-2 p-1 rounded bg-[var(--color-bg)]/90 shadow cursor-grab focus:outline-none"
                        >
                          <GripVertical className="w-4 h-4 text-[var(--color-secondary)]" />
                        </button>

                        <div>{renderItem(item, index)}</div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
