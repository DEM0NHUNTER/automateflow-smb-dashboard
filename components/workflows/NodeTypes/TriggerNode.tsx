import React from "react";
import { AppNode } from "@/lib/utils/types";

/**
 * Trigger Node Component (Graph Entry Point)
 * ------------------------------------------
 * Represents the "Root" of a workflow execution.
 * Unlike ActionNodes, Triggers generally do not have input handles,
 * as they are the starting pulse of the automation.
 */
export function TriggerNode({ data }: { data: AppNode }) {
  return (
    /* * VISUAL SEMANTICS
     * ----------------
     * We use a distinct border color (Blue-500) and slightly heavier stroke (border-2)
     * compared to standard nodes. This establishes a clear visual hierarchy,
     * letting users instantly identify where the data flow begins.
     */
    <div className="w-64 rounded-lg border-2 border-blue-500 bg-white shadow-md">

      {/* Header: Consistent branding with the container border */}
      <div className="flex items-center gap-2 rounded-t-md bg-blue-50 px-4 py-2 border-b border-blue-100">
        <span className="text-xl">⚡</span>
        <div>
          <span className="font-semibold text-blue-900 block text-sm">Trigger</span>
          {/* Technical ID for debugging (e.g., 'gmail-new-email') */}
          <span className="text-xs text-blue-400 font-mono">{data.connectorType}</span>
        </div>
      </div>

      <div className="p-4">
        {/* * CONDITIONAL CONFIG PREVIEW
         * --------------------------
         * Instead of generic text, we try to show high-value configuration data immediately.
         * For scheduled triggers, the Cron expression is the most vital piece of info.
         * TODO: Convert cron expressions (e.g. '0 9 * * 1') to human text ('Every Monday at 9am')
         * using a library like `crony` or `cronstrue`.
         */}
        <p className="text-sm text-gray-500">
          {data.config && data.config.cronExpression
            ? `Schedule: ${data.config.cronExpression}`
            : "Starts automation when event occurs"}
        </p>
      </div>

      {/* * OUTPUT HANDLE PLACEHOLDER
       * -------------------------
       * Visual representation of the data output port.
       * CRITICAL FIX REQUIRED: This div needs to be replaced or wrapped with
       * the library-specific `<Handle type="source" />` component.
       * Without it, this node cannot connect to downstream actions.
       */}
      <div className="absolute -bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-blue-500 bg-white"></div>
    </div>
  );
}