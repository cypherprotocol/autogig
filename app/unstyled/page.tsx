"use client";

import { Button } from "@/components/ui/button";
import { UploadUnstyled } from "@/components/upload-unstyled";
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import { useChat } from "ai/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [dots, setDots] = useState(".");
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { messages, input, setInput, handleSubmit } = useChat();
  const socials = useUserStore((state) => state.socials);
  const stage = useUserStore((state) => state.stage);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        return prevDots.length >= 3 ? "." : prevDots + ".";
      });
    }, 500); // 500ms delay

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  useEffect(() => {
    if (stage === GigStages.FindJob) {
      console.log(session);
      (async function findGig() {
        const res = await fetch("/api/gig?", {
          method: "POST",
          body: JSON.stringify({
            twitter: session?.user?.name ?? "",
            github: socials.github,
            linkedin: socials.linkedin,
            resume: resume,
          }),
        }).then(() => {
          setStage(GigStages.Message);
          console.log("done");
        });
      })();
    }
  }, [stage, session]);

  useEffect(() => {
    if (session) {
      setStage(GigStages.UploadResume);
    }

    // Add contain github/twitter
  }, [session]);

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
        {(() => {
          switch (stage) {
            case GigStages.Start:
              return (
                <Button onClick={() => setStage(GigStages.LinkTwitter)}>
                  Find a job
                </Button>
              );
            case GigStages.LinkTwitter:
              return (
                <>
                  <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                    Link your twitter
                  </h3>
                  <Button onClick={() => signIn("twitter")}>Link</Button>
                </>
              );
            case GigStages.LinkTwitter:
              return (
                <>
                  <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                    Link your github
                  </h3>
                  <Button onClick={() => signIn("github")}>Link</Button>
                </>
              );
            case GigStages.UploadResume:
              return <UploadUnstyled />;
            case GigStages.FindJob:
              return (
                <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  Finding your job{dots}
                </h3>
              );
            case GigStages.Message:
              return (
                <>
                  <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                    Message crafted!
                  </h3>
                  <blockquote className="mt-6 border-l-2 pl-6 italic">
                    Your message has been crafted and sent to the company. You
                    will be notified when they respond.
                  </blockquote>
                </>
              );
          }
        })()}

        <div className="absolute bottom-16 flex space-x-8">
          <p className="text-sm text-muted-foreground">Step {stage} of 5</p>
        </div>
      </div>
    </div>
  );
}
