/* eslint-disable @next/next/no-head-element */

import { PHProvider, PostHogPageview } from "@/app/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { Metadata } from "next";
import { NextIntlClientProvider, useLocale } from "next-intl";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../../styles/globals.css";
import "../../styles/tailwind.css";

const circular = localFont({
  display: "swap",
  src: [
    {
      path: "../../public/fonts/CircularStd-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/CircularStd-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-circular",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://autogig.pro"),
  title: "Autogig",
  description: "Forget applying, just interview.",
  openGraph: {
    type: "website",
    title: "Autogig",
    description: "Forget applying, just interview.",
    images: [
      {
        url: "https://autogig.pro/images/og_image.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  const locale = useLocale();
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <Suspense fallback>
          <PostHogPageview />
        </Suspense>
        <head></head>
        <PHProvider>
          <body className={clsx(circular.variable, circular.className)}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <NextIntlClientProvider locale={locale} messages={messages}>
                <TooltipProvider>
                  <div className="flex min-h-screen flex-col">
                    <main className="flex flex-1 flex-col items-center">
                      {children}
                    </main>
                  </div>
                </TooltipProvider>
                <Toaster />
                <Analytics />
              </NextIntlClientProvider>
            </ThemeProvider>
          </body>
        </PHProvider>
      </html>
    </ClerkProvider>
  );
}
