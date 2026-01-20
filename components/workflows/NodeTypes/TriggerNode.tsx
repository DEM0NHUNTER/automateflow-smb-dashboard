import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { AppNode } from "@/lib/utils/types";

/**
 * Trigger Node Component (Graph Entry Point)
 * ------------------------------------------
 * Represents the "Root" of a workflow execution.
 * Unlike ActionNodes, Triggers generally do not have input handles,
 * as they are the starting pulse of the automation.
 */
export function TriggerNode({ data }: NodeProps) {
  const appData = data as AppNode;
  return (
    /* * VISUAL SEMANTICS
     * ----------------
     * We use a distinct border color (Blue-500) and slightly heavier stroke (border-2)
     * compared to standard nodes. This establishes a clear visual hierarchy,
     * letting users instantly identify where the data flow begins.
     */
    <div className="w-64 rounded-lg border-2 border-blue-500 bg-white shadow-md transition-all hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-md bg-blue-50 px-4 py-2 border-b border-blue-100">
        <span className="text-xl">⚡</span>
        <div>
          <span className="font-semibold text-blue-900 block text-sm">Trigger</span>
          <span className="text-xs text-blue-400 font-mono">{appData.connectorType || "webhook"}</span>
        </div>
      </div>

<div className="p-4">
        <p className="text-sm text-gray-500">
          {appData.config?.cronExpression 
            ? `Schedule: ${appData.config.cronExpression}` 
            : "Starts automation when event occurs"}
        </p>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}
