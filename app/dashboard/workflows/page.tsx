// app/dashboard/workflows/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Calendar, Activity, Trash2, Loader2 } from "lucide-react";
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 1. Fetch Workflows on Load
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

  // 2. Handle Delete Action
  const handleDelete = async (id: string, name: string) => {
    // Simple confirmation dialog
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/workflows/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete");

      // Optimistic UI Update (Remove from list immediately)
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
      toast.success("Workflow deleted");

    } catch (error) {
      toast.error("Could not delete workflow");
      setIsDeleting(null);
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
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Workflows</h1>
          <p className="text-muted-foreground">Manage and monitor your automations.</p>
        </div>
        {/* CREATE NEW BUTTON */}
        <Link href="/dashboard/workflows/new">
          <Button className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> New Workflow
          </Button>
        </Link>
      </div>

      {/* Empty State */}
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
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="group border rounded-xl bg-card p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between h-[200px]">

              {/* Top Row: Name + Delete */}
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
                  onClick={() => handleDelete(workflow.id, workflow.name)}
                  disabled={isDeleting === workflow.id}
                >
                  {isDeleting === workflow.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Middle: Stats */}
              <div className="py-4">
                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>{workflow._count?.executions || 0} runs this month</span>
                 </div>
              </div>

              {/* Bottom: Edit Action */}
              <div className="pt-4 border-t border-border flex justify-end">
                <Link href="/dashboard/workflows/new">
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