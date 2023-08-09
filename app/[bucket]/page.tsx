"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HOME_BUCKETS } from "@/lib/buckets";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Statsig } from "statsig-react";

export async function generateStaticParams() {
  return HOME_BUCKETS.map((group) => ({ bucket: group }));
}

export default function Home({ params }: { params: { bucket: string } }) {
  const bucket = params?.bucket as string;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Statsig.logEvent("visit_home");
  }, []);

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
    <div className="w-full max-w-5xl grow flex-col items-center justify-center px-4 py-8 md:flex-row md:justify-start md:py-20">
      <div className="mb-16 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="relative flex w-full flex-col items-start md:flex-row md:items-center">
          <div className="relative mr-16 h-36 w-36 shrink-0 md:h-80 md:w-80">
            <Image
              src="/fullcolor-retro-dudes-laptop.svg"
              fill
              className="object-contain"
              alt=""
            />
          </div>
          <div className="flex w-full flex-col">
            <h1 className="mb-4 w-full scroll-m-20 font-wagmi text-5xl font-extrabold tracking-tight lg:text-7xl">
              Get a job
              <br />
              <span className="text-[#5c5bee]">without doing shit</span>
            </h1>
            <p className="mb-4 text-slate-600 md:mb-0 md:text-xl">
              $2500 and a guaranteed job at the end of it with a company you are
              excited about, or your money back
            </p>
            <Link href="/contact">
              <Button
                onClick={() => {
                  Statsig.logEvent("contact_us");
                }}
                className="mt-8 h-16 w-48 bg-[#ffc434] text-primary hover:bg-[#fed46f]"
              >
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full">
        <div className="h-[36rem] w-full overflow-hidden rounded-md bg-slate-800">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="https://res.cloudinary.com/autogig/video/upload/v1691369376/Autogig-v2-web_asjahe.mp4"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
