// app/dashboard/settings/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, CreditCard, Users, ShieldAlert } from "lucide-react";

export default function SettingsPage() {

  const handleSave = () => {
    toast.success("Profile Updated", {
      description: "Your settings have been saved locally."
    });
  };

  const handleEnterpriseFeature = () => {
    toast.info("Enterprise Feature", {
      description: "Billing & Team management coming in v1.1 update."
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and workspace.</p>
      </div>

      <div className="space-y-6">

        {/* Profile Section */}
        <div className="border rounded-lg p-6 bg-card space-y-4">
           <div className="flex items-center gap-2 mb-4">
             <User className="w-5 h-5 text-primary" />
             <h3 className="font-semibold text-lg">General Profile</h3>
           </div>

           <div className="grid gap-4">
             <div className="grid gap-2">
               <label className="text-sm font-medium">Display Name</label>
               <input type="text" defaultValue="Demo User" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
             </div>
             <div className="grid gap-2">
               <label className="text-sm font-medium">Email Address</label>
               <input type="email" defaultValue="demo@example.com" disabled className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background opacity-50 cursor-not-allowed" />
             </div>
           </div>

           <div className="pt-2">
             <Button onClick={handleSave}>Save Changes</Button>
           </div>
        </div>

        {/* Team Section */}
        <div className="border rounded-lg p-6 bg-card space-y-4 opacity-75">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-lg">Team Members</h3>
             </div>
             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Coming Soon</span>
           </div>
           <p className="text-sm text-muted-foreground">Invite colleagues to collaborate on workflows.</p>
           <Button variant="outline" onClick={handleEnterpriseFeature} className="w-full">Manage Team</Button>
        </div>

        {/* Billing Section */}
        <div className="border rounded-lg p-6 bg-card space-y-4 opacity-75">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-lg">Billing & Usage</h3>
             </div>
             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Enterprise</span>
           </div>
           <p className="text-sm text-muted-foreground">Manage your subscription and API usage limits.</p>
           <Button variant="outline" onClick={handleEnterpriseFeature} className="w-full">View Invoices</Button>
        </div>

         {/* Danger Zone */}
         <div className="border border-red-200 dark:border-red-900/50 rounded-lg p-6 bg-red-50/50 dark:bg-red-950/10 space-y-4">
           <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Danger Zone</h3>
           </div>
           <p className="text-sm text-muted-foreground">Permanently delete your account and all workflows.</p>
           <Button variant="destructive" size="sm">Delete Account</Button>
        </div>

      </div>
    </div>
  );
}