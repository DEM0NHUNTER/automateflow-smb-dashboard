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
  // 1. Convert AppNode (Database format) -> ReactFlow Node (Visual format)
  const defaultNodes: Node[] = initialNodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: { x: n.positionX, y: n.positionY },
    data: n, // Store full data object here
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync state if AI generates new nodes
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

  // Handle Connections (Drawing Lines)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#6366f1" } }, eds)),
    [setEdges]
  );

  const addNode = (type: "TRIGGER" | "ACTION") => {
    const id = uuidv4();
    // Random offset so they don't stack perfectly
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
    // Convert ReactFlow Nodes -> Back to AppNode format for DB
    const appNodes: AppNode[] = nodes.map((n) => ({
      ...n.data,
      positionX: n.position.x,
      positionY: n.position.y,
    }));
    
    onSave(appNodes, edges);
  };

  return (
    <div className="flex h-screen flex-col">
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
           <span className="text-sm text-muted-foreground mr-4">
             {nodes.length} nodes • {edges.length} connections
           </span>
           <Button onClick={handleSave}>Save Workflow</Button>
        </div>
      </div>

    {/* REACT FLOW CANVAS */}
    <div className="flex-1 h-full w-full">
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
      >
        <Background color="transparent" variant={BackgroundVariant.Dots} />
        <Controls 
          position="bottom-right" 
          className="bg-card border-border text-foreground fill-foreground m-4" 
        />
      </ReactFlow>
    </div>
  );
}
