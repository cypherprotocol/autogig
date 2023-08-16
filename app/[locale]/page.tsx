"use client";

import Offer from "@/components/offer";
import { HOME_BUCKETS } from "@/lib/buckets";

export async function generateStaticParams() {
  return HOME_BUCKETS.map((group) => ({ bucket: group }));
}

export default function Home() {
  return <Offer />;
}
