/* eslint-disable @next/next/no-head-element */

import Navbar from "@/app/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import "../styles/tailwind.css";

export const metadata = {
  title: "Autogig",
  description: "Find a job without doing shit 💩",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
        <TooltipProvider>
          <ClerkProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex flex-1 flex-col items-center bg-muted/50">
                {children}
              </main>
            </div>
          </ClerkProvider>
        </TooltipProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
