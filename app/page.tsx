"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Balancer from "react-wrap-balancer";

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
    <div className="w-full max-w-5xl grow flex-col items-center justify-center px-4 pt-28 md:flex-row md:justify-start">
      <div className="mb-6 flex w-full items-center justify-between">
        <h1 className="w-96 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <Balancer> Get a job without doing shit 💩</Balancer>
        </h1>
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger>
              <Button className="h-16 w-48" disabled={isLoading}>
                Notify me
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <form onSubmit={subscribe} className="flex">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mr-2 "
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="hidden h-full w-full md:flex">
        <div className="h-[36rem] w-full overflow-hidden rounded-md bg-slate-800">
          <video
            autoPlay
            loop
            muted
            src="/autogig.mp4"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
