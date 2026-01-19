"use client";

import React, { useState } from "react";
import { WorkflowCanvas } from "@/components/workflows/WorkflowCanvas";
import { AppNode } from "@/lib/utils/types";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewWorkflowPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedWorkflowId, setSavedWorkflowId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [canvasKey, setCanvasKey] = useState(0);
  const [currentNodes, setCurrentNodes] = useState<AppNode[]>([]);

  const handleSave = async (nodes: AppNode[]) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My AI Automation",
          nodes: nodes,
          userId: "demo-user-123", 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save");

      setSavedWorkflowId(data.workflowId);
      toast.success("Workflow Saved", {
        description: "Your automation has been successfully stored.",
      });
    } catch (error: any) {
      console.error("Save failed:", error);
      toast.error("Save Failed", {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    if (!savedWorkflowId) return;

    const toastId = toast.loading("Initializing workflow execution...");

    try {
      const res = await fetch(`/api/workflows/${savedWorkflowId}/execute`, {
        method: "POST"
      });
      const data = await res.json();

      // Dismiss the loading toast
      toast.dismiss(toastId);

      if (data.success) {
        toast.success("Workflow Executed Successfully", {
          description: "Check your server terminal for the execution logs.",
        });
      } else {
        toast.error("Execution Failed", {
          description: "The workflow could not complete. Check the console for details.",
        });
      }
      
      console.log("Execution Result:", data);

    } catch (e) {
      toast.dismiss(toastId);
      toast.error("Connection Error", {
        description: "Failed to trigger execution. Is the server running?",
      });
    }
  };

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
        setCurrentNodes(data.nodes);
        setCanvasKey(prev => prev + 1);
        setPrompt("");
      }

    } catch (e) {
      console.error(e);
      toast.info("AI Generated Workflow", {
        description: `Created ${data.nodes.length} nodes from your prompt.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      
      {/* Actions Layer */}
      {savedWorkflowId && (
        <div className="absolute top-4 right-36 z-50 animate-in fade-in slide-in-from-top-2">
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
        <div className="bg-card/80 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-border flex gap-2 items-center ring-1 ring-black/5">
          <div className="pl-3 text-indigo-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type 'Email me when I get a Slack message'..."
            className="flex-1 px-2 py-2.5 outline-none text-foreground bg-transparent placeholder:text-muted-foreground text-sm"
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
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="font-medium">Saving your work...</p>
          </div>
        </div>
      )}
    </div>
  );
}
