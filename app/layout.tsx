/* eslint-disable @next/next/no-head-element */

import { Provider } from "@/components/provider";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import "../styles/tailwind.css";

export const metadata = {
  title: "Autogig",
  description: "Find a job",
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
        <Provider>
          <div className="mx-auto">
            {/* <Navbar /> */}
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
