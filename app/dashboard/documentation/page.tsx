// app/dashboard/documentation/page.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

export default function DocumentationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
           <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
           <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">v1.0.0</Badge>
        </div>
        <p className="text-muted-foreground">
          Everything you need to configure and deploy your automation platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">

        {/* Table of Contents */}
        <nav className="hidden md:flex flex-col gap-2 text-sm text-muted-foreground sticky top-6 self-start">
          <span className="font-semibold text-foreground mb-2">On this page</span>
          <a href="#quick-start" className="hover:text-primary transition-colors">Quick Start</a>
          <a href="#branding" className="hover:text-primary transition-colors">White Labeling</a>
          <a href="#ai-config" className="hover:text-primary transition-colors">AI Configuration</a>
          <a href="#support" className="hover:text-primary transition-colors">Support</a>
        </nav>

        {/* Content */}
        <div className="space-y-10">

          <section id="quick-start" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">🚀 Quick Start</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>Prerequisites: Node.js 18+ and a Supabase Project.</p>

              <div className="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto">
                <p className="text-muted-foreground"># 1. Clone & Install</p>
                <p>git clone https://github.com/your-repo/automateflow.git</p>
                <p>cd automateflow</p>
                <p>npm install</p>
                <br/>
                <p className="text-muted-foreground"># 2. Database Setup</p>
                <p>npm run setup</p>
                <br/>
                <p className="text-muted-foreground"># 3. Start Dev Server</p>
                <p>npm run dev</p>
              </div>
            </div>
          </section>

          <section id="branding" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">🎨 White Labeling</h2>
            <p className="text-muted-foreground">
              You can rebrand the dashboard in seconds by editing the config file.
            </p>
            <div className="bg-muted p-4 rounded-md font-mono text-sm border-l-4 border-blue-500">
              <p className="font-bold text-foreground mb-2">File: lib/config/branding.ts</p>
              <pre className="text-xs text-muted-foreground">
{`export const APP_BRANDING = {
  appName: "Your Client App",
  companyName: "Acme Corp",
  colors: { primary: "#000000" }
};`}
              </pre>
            </div>
          </section>

          <section id="ai-config" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">🧠 AI Configuration</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border p-4 rounded-lg bg-card">
                <h3 className="font-medium mb-2">Demo Mode (Free)</h3>
                <p className="text-sm text-muted-foreground mb-2">Simulates AI responses to save costs.</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">NEXT_PUBLIC_IS_DEMO=true</code>
              </div>
              <div className="border p-4 rounded-lg bg-card">
                <h3 className="font-medium mb-2">Production (Live)</h3>
                <p className="text-sm text-muted-foreground mb-2">Connects to real OpenAI GPT-4.</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">NEXT_PUBLIC_IS_DEMO=false</code>
              </div>
            </div>
          </section>

          <section id="support" className="space-y-4">
             <h2 className="text-2xl font-semibold border-b pb-2">🆘 Support</h2>
             <p className="text-muted-foreground">
               For technical support, please contact <a href="mailto:support@example.com" className="text-primary underline">support@example.com</a> or open an issue on the repository.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}