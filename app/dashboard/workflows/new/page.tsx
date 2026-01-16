"use client";

import React, { useState } from "react";
import { WorkflowCanvas } from "@/components/workflows/WorkflowCanvas";
import { AppNode } from "@/lib/utils/types";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Sparkles } from "lucide-react";

/**
 * Workflow Editor Page (Client-Side Orchestrator)
 * -----------------------------------------------
 * This component acts as the "smart container" for the workflow editor.
 * It manages the application state (saving, AI generation, execution)
 * while delegating the complex UI logic to the `WorkflowCanvas`.
 */
export default function NewWorkflowPage() {
  // --- STATE ---

  // UI Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Business Logic State
  const [savedWorkflowId, setSavedWorkflowId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  /*
   * CANVAS STATE STRATEGY
   * ---------------------
   * We store `currentNodes` to pass them down, but we also use `canvasKey`.
   * Why? Many canvas libraries (like ReactFlow) maintain heavy internal state
   * (zoom level, viewport position, selection history).
   * * Updating `currentNodes` via props usually merges changes.
   * Incrementing `canvasKey` forces a full unmount/remount of the component.
   * This is a "brute force" way to ensure the AI-generated nodes completely
   * replace the old state without ghost artifacts, though it resets the viewport.
   */
  const [canvasKey, setCanvasKey] = useState(0);
  const [currentNodes, setCurrentNodes] = useState<AppNode[]>([]);

  // --- HANDLERS ---

  /**
   * Persists the current node configuration to the database.
   * TODO: Move "demo-user-123" to a context-based Auth provider.
   */
  const handleSave = async (nodes: AppNode[]) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My AI Automation",
          nodes: nodes,
          userId: "demo-user-123", // Technical Debt: Replace with session.user.id
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save");

      setSavedWorkflowId(data.workflowId);

      // UX Note: Native alerts are blocking. Consider a Toast library (Sonner/Hot-Toast) for production.
      alert(`✅ Success! Workflow saved. ID: ${data.workflowId}`);

    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`❌ Error saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Triggers the backend execution engine for the saved workflow.
   * Requires a successful save first (savedWorkflowId must exist).
   */
  const handleRun = async () => {
    if (!savedWorkflowId) return;

    try {
      const res = await fetch(`/api/workflows/${savedWorkflowId}/execute`, {
        method: "POST"
      });
      const data = await res.json();

      console.log("Execution Result:", data);
      alert(data.success
        ? "🚀 Workflow Executed! Check your server terminal for logs."
        : "❌ Execution Failed. Check console."
      );
    } catch (e) {
      alert("Failed to trigger execution");
    }
  };

  /**
   * AI Orchestration
   * Sends natural language to the backend -> Receives JSON nodes -> Resets Canvas
   */
  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.nodes) {
        // Critical: Update state AND force-remount the canvas to render fresh nodes
        setCurrentNodes(data.nodes);
        setCanvasKey(prev => prev + 1);
        setPrompt("");
      }

    } catch (e) {
      console.error(e);
      alert("AI Generation failed. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full relative flex flex-col">

      {/* TOP BAR (Conditional)
        Only appears once a workflow is persisted, preventing users from running unsaved work.
        Uses `z-50` to float above the canvas layer.
      */}
      {savedWorkflowId && (
        <div className="absolute top-4 right-4 z-50 animate-in fade-in">
          <Button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2"
          >
            <Play className="w-4 h-4" /> Run Test
          </Button>
        </div>
      )}

      {/* MAIN EDITOR CANVAS
        The `key` prop here is the mechanism that enables the "AI Reset" described above.
      */}
      <div className="flex-1">
        <WorkflowCanvas
          key={canvasKey}
          onSave={handleSave}
          initialNodes={currentNodes}
        />
      </div>

      {/* FLOATING AI COMMAND BAR
        Centered at the bottom to mimic modern "Command Palette" or "Copilot" UX.
        Backdrop blur adds depth and separation from the grid lines behind it.
      */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-2xl border border-blue-200 flex gap-2 items-center transition-all hover:scale-[1.01] hover:shadow-blue-100/50">

          <div className="pl-3 text-blue-500">
            <Sparkles className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your workflow (e.g. 'Send Slack message when I get a Gmail from Boss')..."
            className="flex-1 px-2 py-3 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
            // A11y: Ensure keyboard users can submit without finding the button
            onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
            disabled={isGenerating}
          />

          <Button
            onClick={handleAIGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 shadow-md transition-all hover:shadow-lg disabled:opacity-70"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>

      {/* BLOCKING SAVE OVERLAY
        Prevents race conditions where a user might try to edit nodes while a save is in flight.
      */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-lg font-medium">Saving your workflow...</p>
          </div>
        </div>
      )}
    </div>
  );
}