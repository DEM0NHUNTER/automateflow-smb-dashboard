"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Settings, BookOpen } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { APP_BRANDING } from "@/lib/config/branding";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/workflows", label: "Workflows", icon: LayoutDashboard },
    { href: "/dashboard/workflows/new", label: "Create New", icon: Plus },
  ];

  return (
    <div className="flex h-screen w-full font-sans text-foreground">

      {/* SIDEBAR */}
      <aside className="w-[60px] lg:w-64 flex-shrink-0 border-r border-border bg-card/80 backdrop-blur-sm flex flex-col justify-between z-20">
        <div>
          {/* Logo */}
          <Link href="/dashboard/workflows/new" className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border hover:bg-accent/50 transition-colors">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
               {APP_BRANDING.appName.charAt(0)}
             </div>
             <span className="ml-3 font-bold text-lg hidden lg:block text-foreground">
               {APP_BRANDING.appName}
             </span>
          </Link>

          {/* Dynamic Nav Links */}
          <nav className="p-2 space-y-1 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link
            href="/dashboard/documentation"
            className={cn(
              "flex items-center gap-3 text-sm font-medium px-2 py-1.5 transition-colors",
              pathname === "/dashboard/documentation" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:block">Documentation</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 text-sm font-medium px-2 py-1.5 transition-colors",
              pathname === "/dashboard/settings" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 justify-between flex-shrink-0">
           <h2 className="font-semibold text-foreground">
             {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
           </h2>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}