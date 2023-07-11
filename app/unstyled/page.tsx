"use client";

import { Button } from "@/components/ui/button";
import { UploadUnstyled } from "@/components/upload-unstyled";
import useUserStore from "@/state/user/useUserStore";
import { useChat } from "ai/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [dots, setDots] = useState(".");
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { messages, input, setInput, handleSubmit } = useChat();
  const socials = useUserStore((state) => state.socials);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        return prevDots.length >= 3 ? "." : prevDots + ".";
      });
    }, 500); // 500ms delay

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage === 3) {
      console.log(session);
      (async function findGig() {
        const res = await fetch(
          "/api/gig?" +
            new URLSearchParams({
              twitter: session?.user?.name ?? "",
              github: socials.github,
              linkedin: socials.linkedin,
            })
        ).then(() => {
          setStage(4);
          console.log("done");
        });
      })();
    }
  }, [stage, session]);

  useEffect(() => {
    if (session) {
      setStage(3);
    }
  }, [session]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = event.target.files?.[0];
    const reader = new FileReader();

    if (file) {
      reader.onload = (e) => {
        const content = e.target?.result;
        const question =
          "Can you concisely and accurately summarize this persons expertise based off of their resume.";
        const message = `${question}\n${content}`;
        setInput(message);
      };

      reader.readAsText(file);
    }
  };

  console.log(messages);

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
        {(() => {
          switch (stage) {
            case 0:
              return <Button onClick={() => setStage(1)}>Find a job</Button>;
            case 1:
              return (
                <>
                  <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                    Link your twitter
                  </h3>
                  <Button onClick={() => signIn("twitter")}>Link</Button>
                </>
              );
            case 2:
              return <UploadUnstyled />;
            case 3:
              return (
                <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  Finding your job{dots}
                </h3>
              );
            case 4:
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
