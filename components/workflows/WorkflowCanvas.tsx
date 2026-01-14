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

// --- NEW COMPONENT: Draggable Wrapper ---
// This enables the specific DOM element to be moved
function DraggableNode({ id, left, top, children }: { id: string, left: number, top: number, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  // Calculate the temporary position while dragging (delta)
  // If dragging, we use `transform`. If not, we use the absolute coordinates.
  const style = {
    position: "absolute" as "absolute",
    left: left,
    top: top,
    // This moves the node visually while you drag it
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : 1, // Bring to front while dragging
    touchAction: "none", // Critical for PointerSensor
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

// --- MAIN CANVAS COMPONENT ---
export function WorkflowCanvas({ initialNodes = [], onSave }: CanvasProps) {
  const [nodes, setNodes] = useState<AppNode[]>(initialNodes);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Drag must move 5px before starting (prevents accidental clicks)
      },
    })
  );

  const addNode = (type: "TRIGGER" | "ACTION") => {
    const newNode: AppNode = {
      id: uuidv4(),
      workflowId: "temp",
      type,
      connectorType: type === "TRIGGER" ? "gmail-new-email" : "slack-send-message",
      config: {},
      positionX: 100 + (nodes.length * 30),
      positionY: 100 + (nodes.length * 30),
      parentId: null,
      childId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === active.id) {
          // Permanently update the position state after drag ends
          return {
            ...node,
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
    <div className="flex h-screen flex-col bg-slate-50">
      {/* TOOLBAR */}
      <div className="border-b bg-white p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex gap-2">
          <Button onClick={() => addNode("TRIGGER")} variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
            + Add Trigger
          </Button>
          <Button onClick={() => addNode("ACTION")} variant="outline" className="border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100">
            + Add Action
          </Button>
        </div>
        <div className="flex gap-2 items-center">
           <span className="text-sm text-gray-500 mr-4">
             {nodes.length} nodes
           </span>
           <Button onClick={() => onSave(nodes)}>Save Workflow</Button>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div className="flex-1 relative overflow-hidden">

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
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
               <div className="opacity-80">
                 {/* Optional: Render a "ghost" version while dragging.
                     For now, we just let the original move. */}
               </div>
             ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}