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

  const variant = useFeatureFlagVariantKey("offers");

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      toast({
        title: "Subscribed",
        description: "Subscription successful. Thank you!",
      });
    } else {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }

    setIsLoading(false);
    setEmail("");
  };

  return (
    <>
      {(() => {
        switch (variant) {
          case "a":
            return <OfferA />;
          case "b":
            return <OfferB />;
          case "c":
            return <OfferC />;
          case "d":
            return <OfferD />;
        }
      })()}
    </>
  );
}
