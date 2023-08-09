"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init("phc_6ltAoWOCKyM9629q34EWBsFH9SL3xzEFRvzmghr1EIz", {
      api_host: "https://app.posthog.com",
    });

    posthog.capture("my event", { property: "value" });
  }, []);

  return <>children</>;
}
