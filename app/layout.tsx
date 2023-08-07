/* eslint-disable @next/next/no-head-element */

import Navbar from "@/app/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import "../styles/tailwind.css";

const circular = localFont({
  display: "swap",
  src: [
    {
      path: "../public/fonts/CircularStd-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CircularStd-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-circular",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://autogig.pro"),
  title: "Autogig",
  description: "Get a job without doing shit",
  openGraph: {
    type: "website",
    title: "Autogig",
    description: "Get a job without doing shit",
    images: [
      {
        url: "https://autogig.pro/og_image.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body className={clsx(circular.variable, circular.className)}>
        <TooltipProvider>
          <ClerkProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex flex-1 flex-col items-center bg-white">
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
