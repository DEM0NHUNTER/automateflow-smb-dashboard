// app/dashboard/workflows/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Calendar, Activity, Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Workflow {
  id: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED";
  updatedAt: string;
  _count?: { executions: number };
}

export default function WorkflowsListPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the Custom Delete Modal
  const [workflowToDelete, setWorkflowToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Workflows
  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch("/api/workflows");
        const data = await res.json();
        if (Array.isArray(data)) {
          setWorkflows(data);
        }
      } catch (error) {
        console.error("Failed to fetch workflows", error);
        toast.error("Error loading workflows");
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkflows();
  }, []);

  // 2. The Delete Logic (Called by the Modal)
  const confirmDelete = async () => {
    if (!workflowToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/workflows/${workflowToDelete.id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete");

      // Optimistic UI Update
      setWorkflows((prev) => prev.filter((w) => w.id !== workflowToDelete.id));
      toast.success("Workflow deleted successfully");

      // Close Modal
      setWorkflowToDelete(null);

    } catch (error) {
      toast.error("Could not delete workflow");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground animate-pulse gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading workflows...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative">

      {/* --- CUSTOM DELETE MODAL --- */}
      {workflowToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

          {/* Backdrop (Blur & Darken) */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-all animate-in fade-in duration-200"
            onClick={() => setWorkflowToDelete(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-xl border border-border bg-card p-6 text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:my-8">

            <div className="flex flex-col gap-4">
              {/* Icon & Title */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-foreground">
                    Delete Workflow?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50">
                You are about to permanently delete <span className="font-semibold text-foreground">"{workflowToDelete.name}"</span> and all its history.
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setWorkflowToDelete(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete Forever
                </Button>
              </div>
            </div>

            {/* Close X (Top Right) */}
            <button
              onClick={() => setWorkflowToDelete(null)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Workflows</h1>
          <p className="text-muted-foreground">Manage and monitor your automations.</p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> New Workflow
          </Button>
        </Link>
      </div>

      {workflows.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center space-y-4 bg-card/50">
           <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
             <Activity className="w-6 h-6" />
           </div>
           <div>
             <h3 className="font-semibold text-lg">No workflows yet</h3>
             <p className="text-muted-foreground">Create your first automation to get started.</p>
           </div>
           <Link href="/dashboard/workflows/new">
             <Button variant="outline">Create Now</Button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="group border rounded-xl bg-card p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between h-[200px]">

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <h3 className="font-semibold text-lg truncate max-w-[180px]" title={workflow.name}>
                        {workflow.name}
                     </h3>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                     <Badge variant={workflow.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px] h-5 px-1.5">
                       {workflow.status}
                     </Badge>
                     <span>•</span>
                     <span className="flex items-center gap-1">
                       <Calendar className="w-3 h-3" />
                       {new Date(workflow.updatedAt).toLocaleDateString()}
                     </span>
                   </div>
                </div>

                {/* DELETE BUTTON */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  onClick={() => setWorkflowToDelete({ id: workflow.id, name: workflow.name })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="py-4">
                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>{workflow._count?.executions || 0} runs this month</span>
                 </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Link href={`/dashboard/workflows/${workflow.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary">
                    Open Editor <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}