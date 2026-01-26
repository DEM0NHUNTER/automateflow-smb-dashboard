// This is the root layout of the application, defining global styles, fonts, and metadata.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

/*
 * FONT OPTIMIZATION
 * -----------------
 * We use `next/font` to automatically optimize and load Inter.
 * KEY BENEFITS:
 * 1. Self-hosting: The font file is downloaded at build time and served from our domain.
 * This eliminates the extra RTT (Round Trip Time) to Google Fonts.
 * 2. Zero Layout Shift (CLS): Next.js injects a fallback system font with
 * metrics adjusted to match Inter, preventing text from "jumping" when the font loads.
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * GLOBAL METADATA CONFIG
 * ----------------------
 * This export defines the default SEO strategy for the entire application.
 * Nested pages can override these values (e.g., changing the title), but
 * this serves as the fallback for OpenGraph images, descriptions, etc.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: "AutomateFlow - SMB Dashboard",
  description: "AI-powered automation for small businesses",
};

/**
 * ROOT LAYOUT
 * -----------------------------
 * This component is the entry point for the entire DOM tree in the App Router.
 * Unlike the old `_document.js` + `_app.js` pattern, this single file controls
 * the <html> and <body> tags.
 * * * PERSISTENCE:
 * This layout does NOT re-render on navigation between pages. It persists,
 * maintaining state (like scroll position or active search inputs) if they were kept here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

          <div className="fixed inset-0 z-[-1] h-full w-full bg-background">
            <div className="absolute h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_60%,transparent_100%)]"></div>
          </div>
          {children}
          <Toaster position="top-center" richColors />  
        </ThemeProvider>
      </body>
    </html>
  );
}
