import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold">AutomateFlow</h1>
      </div>

      <div className="relative flex place-items-center flex-col gap-6">
        <div className="text-center">
          <p className="mb-6 text-lg text-slate-300">
            Build AI-powered workflows in plain English.
          </p>

          <Link href="/dashboard/workflows/new">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all">
              Try the Workflow Builder &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}