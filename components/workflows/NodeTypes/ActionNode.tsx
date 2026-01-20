import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { AppNode } from "@/lib/utils/types";

export function ActionNode({ data }: NodeProps) {
  const appData = data as AppNode;

  return (
    <div className="w-64 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 transition-colors">      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />

      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-md bg-gray-50 px-4 py-2 border-b">
        <span className="text-xl">🔧</span>
        <div>
          <span className="font-semibold text-gray-700 block text-sm">Action</span>
          <span className="text-xs text-gray-400 font-mono">{appData.connectorType || "custom-action"}</span>
        </div>
      </div>

      <div className="p-4 text-sm text-gray-600">
        Run action logic
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}
