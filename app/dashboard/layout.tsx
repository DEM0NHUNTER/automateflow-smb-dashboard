import React from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Settings } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full font-sans text-foreground">
      {/* --- SIDEBAR --- */}
      <aside className="w-[60px] lg:w-64 flex-shrink-0 border-r border-border bg-card/80 backdrop-blur-sm flex flex-col justify-between z-20">
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
               A
             </div>
             <span className="ml-3 font-bold text-lg hidden lg:block text-slate-800">
               AutomateFlow
             </span>
          </div>

          {/* Nav Links */}
          <nav className="p-2 space-y-1 mt-4">
            <Link 
              href="/dashboard/workflows" 
              className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden lg:block font-medium">Workflows</span>
            </Link>

            <Link 
              href="/dashboard/workflows/new" 
              className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden lg:block font-medium">Create New</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button className="flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-sm font-medium">
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block">Settings</span>
          </button>
          <ModeToggle /> {/* The Dark Mode Switch */}
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-card/80 flex items-center px-6 justify-between flex-shrink-0">
           <h2 className="font-semibold text-slate-700">Workflow Editor</h2>
           <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
               JD
             </div>
           </div>
        </header>

        {/* The Page Content (Canvas) */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}
