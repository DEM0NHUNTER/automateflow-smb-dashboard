"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Calendar, Activity, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkflows();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full text-muted-foreground animate-pulse">
        Loading workflows...
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
        <Link href="/dashboard/workflows/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Workflow
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {workflows.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center space-y-4">
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

              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <h3 className="font-semibold text-lg truncate max-w-[200px]">{workflow.name}</h3>
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
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Middle (Stats) */}
              <div className="py-4">
                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>{workflow._count?.executions || 0} runs this month</span>
                 </div>
              </div>

              {/* Bottom Action */}
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