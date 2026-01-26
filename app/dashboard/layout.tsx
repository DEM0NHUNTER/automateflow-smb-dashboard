// app/dashboard/layout.tsx
import React from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Settings, BookOpen, User } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { APP_BRANDING } from "@/lib/config/branding";

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
          <Link href="/dashboard/workflows/new" className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border hover:bg-accent/50 transition-colors">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
               {APP_BRANDING.appName.charAt(0)}
             </div>
             <span className="ml-3 font-bold text-lg hidden lg:block text-foreground">
               {APP_BRANDING.appName}
             </span>
          </Link>

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
              className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden lg:block font-medium">Create New</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link href="/dashboard/documentation" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-2 py-1.5">
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:block">Documentation</span>
          </Link>

          <Link href="/dashboard/settings" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-2 py-1.5">
            <Settings className="w-4 h-4" />
            <span className="hidden lg:block">Settings</span>
          </Link>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">JD</div>
                <span className="text-[10px] text-muted-foreground hidden lg:block">Demo User</span>
             </div>
             <ModeToggle />
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Simple Header */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 justify-between flex-shrink-0">
           <h2 className="font-semibold text-foreground">Dashboard</h2>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}