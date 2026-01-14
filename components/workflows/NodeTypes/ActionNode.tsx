import React from "react";
import { AppNode } from "@/lib/utils/types";

export function ActionNode({ data }: { data: AppNode }) {
  return (
    <div className="w-64 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300">
      <div className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gray-400 bg-white"></div>

      <div className="flex items-center gap-2 rounded-t-md bg-gray-50 px-4 py-2 border-b">
        <span className="text-xl">🔧</span>
        <div>
          <span className="font-semibold text-gray-700 block text-sm">Action</span>
          <span className="text-xs text-gray-400 font-mono">{data.connectorType}</span>
        </div>
      </div>

      <div className="p-4 text-sm text-gray-600">
        Run action logic
      </div>
    </div>
  );
}