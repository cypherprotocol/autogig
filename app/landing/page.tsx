"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
    <div className="relative z-10 flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      <div className="flex w-full max-w-6xl">
        <div className="mr-16 flex w-full flex-col items-start justify-center">
          <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Get a job without doing shit 💩
          </h1>
          <p className="mb-6 leading-7">
            Upload your resume, land your dream gig. Job hunting has never been
            this effortless.
          </p>
          <form onSubmit={subscribe} className="flex">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="mr-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Notify
            </Button>
          </form>
        </div>
        <div className="flex h-full w-full">
          <div className="h-96 w-full rounded-md bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
