"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="w-full max-w-5xl grow flex-col items-center justify-center px-4 py-16 md:flex-row md:justify-start md:py-20">
      <div className="mb-16 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="relative flex items-center">
          <Image
            src="/fullcolor-retro-dudes-laptop.svg"
            width={250}
            height={250}
            className="mr-16"
            alt=""
          />
          <div className="flex flex-col">
            <h1 className="mb-4 w-[48rem] scroll-m-20 font-wagmi text-4xl font-extrabold tracking-tight lg:text-7xl">
              Get a job
              <br />
              <span className="text-[#5c5bee]">without doing shit</span>
            </h1>
            <p className="mb-4 text-xl text-slate-600 md:mb-0">
              Upload your resume and land a job effortlessly with 1 click.
            </p>
            <Link href="/find">
              <Button className="mt-8 h-16 w-48 bg-[#ffc434] text-primary hover:bg-[#fed46f]">
                Try it now!
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
