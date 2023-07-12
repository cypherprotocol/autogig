"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "@/components/upload";
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface GigResponse {
  response: string;
  jobName: string;
  jobLink: string;
  jobDescription: string;
}

export default function Home() {
  const [dots, setDots] = useState(".");
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const socials = useUserStore((state) => state.socials);
  const stage = useUserStore((state) => state.stage);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);
  const job = useUserStore((state) => state.job);
  const setJob = useUserStore((state) => state.setJob);
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState("");

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
        })
          .then((res) => res.json())
          .then((res: GigResponse) => {
            console.log(res);
            setResponse(res.response);
            setJob(res.jobName, res.jobLink, res.jobDescription);
            setStage(GigStages.Message);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [stage, session]);

  // useEffect(() => {
  //   if (session) {
  //     setStage(GigStages.UploadResume);
  //   }

  //   // Add contain github/twitter
  // }, [session]);

  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
      {(() => {
        switch (stage) {
          case GigStages.Start:
            return (
              <Button onClick={() => setStage(GigStages.UploadResume)}>
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
          case GigStages.LinkGithub:
            return (
              <>
                <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  Link your github
                </h3>
                <Button onClick={() => signIn("github")}>Link</Button>
              </>
            );
          case GigStages.UploadResume:
            return <Upload />;
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
                <a href={job.link} target="_blank" rel="noreferrer">
                  <Card>
                    <CardHeader>
                      <CardTitle>{job.name}</CardTitle>
                      <CardDescription>{job.link}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
                <blockquote className="my-8 h-80 w-1/2 overflow-y-scroll border-l-2 pl-6 italic">
                  {response}
                </blockquote>
                <CopyToClipboard text={response} onCopy={() => setCopied(true)}>
                  <Button>{copied ? "Copied!" : "Copy to clipboard"}</Button>
                </CopyToClipboard>
              </>
            );
        }
      })()}

      <div className="absolute bottom-16 flex space-x-8">
        <p className="text-sm text-muted-foreground">Step {stage} of 5</p>
      </div>
    </div>
  );
}
