// Description: Landing page for AutomateFlow with header and call-to-action button.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/workflows/new");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      
      {/* 1. Header Section - Centered */}
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight">
          AutomateFlow
        </h1>
        <p className="text-xl text-slate-400 max-w-[600px]">
          Build AI-powered workflows in plain English.
        </p>
      </div>

      {/* 2. Call to Action Button */}
      <div className="flex flex-col items-center gap-6">
        <Link href="/dashboard/workflows/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-10 rounded-full text-lg transition-all shadow-lg hover:shadow-blue-500/25">
            Try the Workflow Builder &rarr;
          </Button>
        </Link>
      </div>

    </main>
  );
}
