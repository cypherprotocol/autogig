"use client";
/* eslint-disable @next/next/no-head-element */

import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import "../styles/tailwind.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
        <div className="mx-auto">
          {/* <Navbar /> */}
          {children}
        </div>
      </body>
    </html>
  );
}
