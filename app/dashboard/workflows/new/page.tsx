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
    // We removed "h-full" here because the parent layout provides the height context
    <div className="w-full h-full relative flex flex-col">
      
      {/* Actions Layer */}
      {savedWorkflowId && (
        <div className="absolute top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <Button 
            onClick={handleRun} 
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2"
          >
            <Play className="w-4 h-4" /> Run Test
          </Button>
        </div>
      )}

      {/* Canvas Layer */}
      <div className="flex-1 w-full h-full relative">
        <WorkflowCanvas 
          key={canvasKey} 
          onSave={handleSave} 
          initialNodes={currentNodes} 
        />
      </div>

      {/* AI Bar Layer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-slate-200 flex gap-2 items-center ring-1 ring-black/5">
          <div className="pl-3 text-indigo-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type 'Email me when I get a Slack message'..."
            className="flex-1 px-2 py-2.5 outline-none text-slate-700 bg-transparent placeholder:text-slate-400 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
            disabled={isGenerating}
          />
          <Button 
            onClick={handleAIGenerate}
            disabled={isGenerating || !prompt.trim()}
            size="sm"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 h-9"
          >
            {isGenerating ? "..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Saving Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] text-white">
          <div className="bg-white text-slate-900 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="font-medium">Saving your work...</p>
          </div>
        </div>
      )}
    </div>
  );
}
