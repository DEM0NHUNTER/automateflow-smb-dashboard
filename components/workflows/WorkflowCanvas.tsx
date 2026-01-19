// components/workflows/WorkflowCanvas.tsx
"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, useDraggable } from "@dnd-kit/core";
import { AppNode } from "@/lib/utils/types";
import { TriggerNode } from "./NodeTypes/TriggerNode";
import { ActionNode } from "./NodeTypes/ActionNode";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface CanvasProps {
  initialNodes?: AppNode[];
  onSave: (nodes: AppNode[]) => void;
}

/**
 * Draggable Wrapper Component
 * ---------------------------
 * Acts as the "Physics Body" for our visual nodes.
 * It separates the drag mechanics (event listeners, transform math)
 * from the presentation logic (TriggerNode/ActionNode).
 */
function DraggableNode({ id, left, top, children }: { id: string, left: number, top: number, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  /*
   * PERFORMANCE OPTIMIZATION: CSS TRANSFORMS
   * ----------------------------------------
   * During the drag operation (which fires ~60 times per second), we use
   * CSS `transform` rather than updating `top/left` state.
   * * Why?
   * 1. 'transform' runs on the GPU (Compositor thread).
   * 2. 'top/left' triggers Layout recalculations on the CPU (Main thread).
   * This ensures buttery smooth 60fps dragging even with complex nodes.
   */
  const style = {
    position: "absolute" as "absolute",
    left: left,
    top: top,
    // Apply the temporary delta during the drag
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : 1, // Z-Index promotion prevents clipping behind other nodes
    touchAction: "none", // Critical: Disables browser scrolling on touch devices while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

/**
 * Main Workflow Canvas (Infinite Whiteboard)
 * ------------------------------------------
 * Orchestrates the node state and drag context.
 * * ARCHITECTURAL NOTE:
 * We are using @dnd-kit here, which provides excellent "free-form" dragging primitives.
 * However, unlike React Flow, it does not handle *Edges* (lines between nodes) out of the box.
 * Future Scope: An SVG layer must be added behind these nodes to render connections.
 */
export function WorkflowCanvas({ initialNodes = [], onSave }: CanvasProps) {
  const [nodes, setNodes] = useState<AppNode[]>(initialNodes);
  const [activeId, setActiveId] = useState<string | null>(null);

  /*
   * SENSOR CONFIGURATION
   * --------------------
   * We require a movement of 5 pixels (activationConstraint) before a drag registers.
   * This differentiates a "Click" (to select/edit a node) from a "Drag" (to move it).
   * Without this, users would accidentally move nodes every time they tried to click settings.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const addNode = (type: "TRIGGER" | "ACTION") => {
    // Basic heuristics to prevent nodes from stacking directly on top of each other
    const offset = nodes.length * 30;

    const newNode: AppNode = {
      id: uuidv4(),
      workflowId: "temp",
      type,
      // Default to common types for MVP
      connectorType: type === "TRIGGER" ? "gmail-new-email" : "slack-send-message",
      config: {},
      positionX: 100 + offset,
      positionY: 100 + offset,
      parentId: null,
      childId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  /**
   * Finalizes the drag operation.
   * Merges the temporary `transform` delta into the permanent `positionX/Y` state.
   */
  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === active.id) {
          return {
            ...node,
            // Calculate new absolute coordinates
            positionX: node.positionX + delta.x,
            positionY: node.positionY + delta.y,
          };
        }
        return node;
      })
    );
    setActiveId(null);
  }

return (
    <div className="flex h-screen flex-col">
      
      {/* TOOLBAR */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm p-4 flex justify-between items-center z-10">
        <div className="flex gap-2">
          <Button 
            onClick={() => addNode("TRIGGER")} 
            variant="outline" 
            className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
          >
            + Add Trigger
          </Button>

          <Button 
            onClick={() => addNode("ACTION")} 
            variant="outline" 
            className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            + Add Action
          </Button>
        </div>

        <div className="flex gap-2 items-center">
           <span className="text-sm text-muted-foreground mr-4">
             {nodes.length} nodes
           </span>
           <Button onClick={() => onSave(nodes)}>Save Workflow</Button>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div className="flex-1 relative overflow-hidden">

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
            <div className="text-center">
              <p className="text-2xl mb-2 font-semibold">Empty Canvas</p>
              <p>Click "Add Trigger" to start building</p>
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(e.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          {nodes.map((node) => (
            <DraggableNode
              key={node.id}
              id={node.id}
              left={node.positionX}
              top={node.positionY}
            >
              {node.type === "TRIGGER" ? (
                <TriggerNode data={node} />
              ) : (
                <ActionNode data={node} />
              )}
            </DraggableNode>
          ))}

          <DragOverlay>
              {activeId ? (
                <div className="opacity-80"></div>
              ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
