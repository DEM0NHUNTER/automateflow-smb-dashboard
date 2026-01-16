import React from "react";
import { AppNode } from "@/lib/utils/types";

/**
 * Action Node Component (Custom Node Visualization)
 * -------------------------------------------------
 * Renders a "Step" in the workflow graph that performs a task (e.g., Send Slack Message).
 *
 * ARCHITECTURAL NOTE:
 * This component is intended to be passed to the Node Graph renderer (e.g., React Flow).
 * Unlike standard React components, its layout (positioning) is controlled by the
 * parent canvas engine, while its internal content is controlled here.
 */
export function ActionNode({ data }: { data: AppNode }) {
  return (
    /* * FIXED WIDTH STRATEGY
     * --------------------
     * We use a fixed width (w-64) rather than `w-auto`.
     * REASONING: In node graphs, variable-width nodes cause "layout thrashing"
     * and make automatic edge routing (lines between nodes) messy and jagged.
     * Uniform widths lead to cleaner, more predictable diagrams.
     */
    <div className="w-64 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300">

      {/* * TODO: REPLACE WITH FUNCTIONAL HANDLE
       * ------------------------------------
       * Currently, this is a purely visual CSS circle representing an input port.
       * CRITICAL FIX: For React Flow integration, this must be replaced with:
       * `<Handle type="target" position={Position.Top} />`
       * Without the actual library Handle, users cannot drag-and-drop connections here.
       */}
      <div className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gray-400 bg-white"></div>

      {/* Header Section: Visual Hierarchy for "Scanning" */}
      <div className="flex items-center gap-2 rounded-t-md bg-gray-50 px-4 py-2 border-b">
        <span className="text-xl">🔧</span>
        <div>
          <span className="font-semibold text-gray-700 block text-sm">Action</span>

          {/* * UX IMPROVEMENT:
           * Currently displaying the raw technical ID (e.g., 'slack-send-message').
           * Future Refactor: Wrap this in a generic `getLabel(data.connectorType)` helper
           * to display friendly text like "Send Slack Msg".
           */}
          <span className="text-xs text-gray-400 font-mono">{data.connectorType}</span>
        </div>
      </div>

      <div className="p-4 text-sm text-gray-600">
        Run action logic
      </div>
    </div>
  );
}