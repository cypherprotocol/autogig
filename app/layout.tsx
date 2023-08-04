/* eslint-disable @next/next/no-head-element */

import Navbar from "@/app/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "../styles/globals.css";
import "../styles/tailwind.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://autogig.pro"),
  title: "Autogig",
  description: "Get a job without doing shit",
  openGraph: {
    type: "website",
    title: "Autogig",
    description: "Get a job without doing shit",
    // images: [
    //   {
    //     url: "https://res.cloudinary.com/honeyjar/image/upload/v1677023883/THJ_WebBanner.jpg",
    //   },
    // ],
  },
  // twitter: {
  //   card: "summary_large_image",
  // },
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
