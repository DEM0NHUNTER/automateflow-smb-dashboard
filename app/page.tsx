import Link from "next/link";
import { Button } from "@/components/ui/button";


/**
 * Public Landing Page
 * ----------------------------------
 * This component serves as the marketing entry point for the application.
 * Unlike the dashboard pages, this layout is optimized for:
 * 1. SEO (Semantic H1 tags, clear hierarchy)
 * 2. Conversion (Clear Call-to-Action to enter the app)
 * 3. Visual Impact (High contrast slate-900 theme)
 */
export default function Home() {
  return (
    /* * HERO LAYOUT STRATEGY
     * --------------------
     * `min-h-screen`: Forces the container to be at least the height of the viewport.
     * `flex-col` + `justify-center`: Vertically stacks and centers the content.
     * This ensures the CTA is always "above the fold" and central, regardless of screen size.
     */
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Semantic H1 for SEO relevance */}
        <h1 className="text-4xl font-bold mb-8">AutomateFlow</h1>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center">
          <p className="mb-6 text-lg text-slate-300">
            Build AI-powered workflows in plain English.
          </p>

          {/* * CLIENT-SIDE NAVIGATION
           * ----------------------
           * We use `Link` instead of `<a>