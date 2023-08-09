"use client";
import { PostHogProvider } from "posthog-js/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const options = {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  };

  return (
    <PostHogProvider
      apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      {children}
    </PostHogProvider>
  );
}
