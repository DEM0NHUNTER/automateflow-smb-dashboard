"use client";

import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { AppNode } from "@/lib/utils/types";
import { TriggerNode } from "./NodeTypes/TriggerNode";
import { ActionNode } from "./NodeTypes/ActionNode";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
  TRIGGER: TriggerNode,
  ACTION: ActionNode,
};

interface CanvasProps {
  initialNodes?: AppNode[];
  onSave: (nodes: AppNode[], edges: Edge[]) => void;
}

export function WorkflowCanvas({ initialNodes = [], onSave }: CanvasProps) {
  const defaultNodes: Node[] = initialNodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: { x: n.positionX, y: n.positionY },
    data: n,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(
        initialNodes.map((n) => ({
          id: n.id,
          type: n.type,
          position: { x: n.positionX, y: n.positionY },
          data: n,
        }))
      );
    }
  }, [initialNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#6366f1" } }, eds)),
    [setEdges]
  );

  const addNode = (type: "TRIGGER" | "ACTION") => {
    const id = uuidv4();
    const position = { x: 200 + Math.random() * 50, y: 200 + Math.random() * 50 };

    const newNode: Node = {
      id,
      type,
      position,
      data: {
        id,
        type,
        connectorType: type === "TRIGGER" ? "gmail-new-email" : "slack-send-message",
        config: {},
        positionX: position.x,
        positionY: position.y,
      } as AppNode,
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    const appNodes: AppNode[] = nodes.map((n) => ({
      ...n.data,
      positionX: n.position.x,
      positionY: n.position.y,
    }));

    onSave(appNodes, edges);
  };

  return (
    <div className="flex h-full flex-col">
      {/* TOOLBAR */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm p-4 flex justify-between items-center z-10">
        <div className="flex gap-2">
          <Button onClick={() => addNode("TRIGGER")} variant="outline" className="border-primary/20 bg-primary/10 text-primary">
            + Add Trigger
          </Button>
          <Button onClick={() => addNode("ACTION")} variant="outline" className="border-border bg-secondary text-secondary-foreground">
            + Add Action
          </Button>
        </div>

        <div className="flex gap-2 items-center">
           <Button onClick={handleSave}>Save Workflow</Button>
        </div>
      </div>

      <div className="flex-1 h-full w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 1, maxZoom: 1 }}
          minZoom={0.5}
          maxZoom={2}
          autoPanOnNodeDrag={true}
          autoPanOnConnect={true}
        >
          <Background color="transparent" variant={BackgroundVariant.Dots} />

          <Controls
            position="bottom-right"
            showInteractive={false}
            className="mb-24 mr-8 bg-card/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-1 [&>button]:border-none [&>button]:bg-transparent [&>button]:text-muted-foreground [&>button]:fill-current [&>button:hover]:bg-primary/10 [&>button:hover]:text-primary [&>button]:rounded-xl [&>button]:w-10 [&>button]:h-10 [&>button]:transition-all"
          />
        </ReactFlow>

        <div className="absolute bottom-24 left-8 z-50 pointer-events-none">
          <div className="bg-card/80 backdrop-blur-md border border-border shadow-lg rounded-full px-4 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {nodes.length} nodes • {edges.length} connections
          </div>
        </div>

      </div>
    </div>
  );
}