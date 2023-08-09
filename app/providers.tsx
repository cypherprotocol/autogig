"use client";

import { StatsigProvider } from "statsig-react";

export default function Providers({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      waitForInitialization={true}
      user={{
        userID: userId,
      }}
      options={{
        environment: { tier: "staging" },
      }}
    >
      {children}
    </StatsigProvider>
  );
}
