import React from "react";
import { AppNode } from "@/lib/utils/types";

export function TriggerNode({ data }: { data: AppNode }) {
  return (
    <div className="w-64 rounded-lg border-2 border-blue-500 bg-white shadow-md">
      <div className="flex items-center gap-2 rounded-t-md bg-blue-50 px-4 py-2 border-b border-blue-100">
        <span className="text-xl">⚡</span>
        <div>
          <span className="font-semibold text-blue-900 block text-sm">Trigger</span>
          <span className="text-xs text-blue-400 font-mono">{data.connectorType}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">
          {data.config && data.config.cronExpression
            ? `Schedule: ${data.config.cronExpression}`
            : "Starts automation when event occurs"}
        </p>
      </div>
      <div className="absolute -bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-blue-500 bg-white"></div>
    </div>
  );
}