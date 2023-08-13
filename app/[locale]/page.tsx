"use client";

import Offer from "@/components/offer";
import { HOME_BUCKETS } from "@/lib/buckets";
import { useFeatureFlagVariantKey } from "posthog-js/react";

export async function generateStaticParams() {
  return HOME_BUCKETS.map((group) => ({ bucket: group }));
}

export default function Home() {
  const variant = useFeatureFlagVariantKey("offer");

  return <Offer />;
}
