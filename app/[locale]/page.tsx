"use client";

import Navbar from "@/app/navbar";
import Offer from "@/components/offer";
import { HOME_BUCKETS } from "@/lib/buckets";
import { useDetectAdBlock } from "adblock-detect-react";
import Image from "next/image";

export async function generateStaticParams() {
  return HOME_BUCKETS.map((group) => ({ bucket: group }));
}

export default function Home() {
  const adBlockDetected = useDetectAdBlock();

  return (
    <>
      {adBlockDetected ? (
        <>
          <Image
            src="/fullcolor-retro-dudes-lock.svg"
            width={200}
            height={200}
            alt=""
            className="mb-4"
          />
          <h3 className="mb-8 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
            Please disable your adblocker to continue using Autogig.
          </h3>
        </>
      ) : (
        <>
          <Navbar />
          <Offer />
        </>
      )}
    </>
  );
}
