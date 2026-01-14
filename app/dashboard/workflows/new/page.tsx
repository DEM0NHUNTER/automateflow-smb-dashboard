"use client";

import { WorkflowCanvas } from "@/components/workflows/WorkflowCanvas";
import { AppNode } from "@/lib/utils/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewWorkflowPage() {
  const [isSaving, setIsSaving] = useState(false);
  // Track the ID after we save, so we can run it
  const [savedWorkflowId, setSavedWorkflowId] = useState<string | null>(null);

  const handleSave = async (nodes: AppNode[]) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My First Automation",
          nodes: nodes,
          userId: "demo-user-123",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSavedWorkflowId(data.workflowId); // <--- Store ID here
      alert(`Saved! ID: ${data.workflowId}`);

    } catch (error: any) {
      alert(`Error saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    if (!savedWorkflowId) return;

    try {
      const res = await fetch(`/api/workflows/${savedWorkflowId}/execute`, {
        method: "POST"
      });
      const data = await res.json();
      console.log("Execution Result:", data);
      alert(data.success ? "Workflow Executed Successfully! Check Server Console." : "Execution Failed");
    } catch (e) {
      alert("Failed to trigger execution");
    }
  };

  return (
    <div className="h-full relative">
      <WorkflowCanvas
        onSave={handleSave}
        initialNodes={[]}
      />

      {/* Run Button (Only appears after saving) */}
      {savedWorkflowId && (
        <div className="absolute top-4 right-48 z-50">
          <Button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ▶ Run Test
          </Button>
        </div>
      )}

      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
          Saving...
        </div>
      )}
    </div>
  );
}