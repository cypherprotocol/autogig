"use client";

import OfferA from "@/components/offer-a";
import OfferB from "@/components/offer-b";
import OfferC from "@/components/offer-c";
import OfferD from "@/components/offer-d";
import { useToast } from "@/components/ui/use-toast";
import { HOME_BUCKETS } from "@/lib/buckets";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useState } from "react";

export async function generateStaticParams() {
  return HOME_BUCKETS.map((group) => ({ bucket: group }));
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const variant = useFeatureFlagVariantKey("offer");

  return (
    <>
      {(() => {
        switch (variant) {
          case "control":
            return <OfferA />;
          case "test":
            return <OfferB />;
          case "test_group_2":
            return <OfferC />;
          case "test_group_3":
            return <OfferD />;
        }
      })()}
    </>
  );
}
