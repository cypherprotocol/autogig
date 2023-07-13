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
import Image from "next/image";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface GigResponse {
  response: string;
  companyName: string;
  companyLogo: string;
  jobLink: string;
  jobTitle: string;
}

export default function Home() {
  const [dots, setDots] = useState(".");
  const { data: session, status } = useSession();
  const socials = useUserStore((state) => state.socials);
  const stage = useUserStore((state) => state.stage);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);
  const job = useUserStore((state) => state.job);
  const setJob = useUserStore((state) => state.setJob);
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fakeLoadingText = [
    "Analyzing your resume",
    "Collecting the data",
    "Finding your dream job",
    "Crafting your message",
  ];

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
      const intervalId = setInterval(() => {
        if (currentIndex !== fakeLoadingText.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 3000); // Update every 3  seconds

      return () => {
        clearInterval(intervalId); // Clear interval on unmount
      };
    }
  }, [currentIndex, fakeLoadingText.length, stage]);

  useEffect(() => {
    if (stage === GigStages.FindJob) {
      (async function findGig() {
        const res = await fetch("/api/gig?", {
          method: "POST",
          body: JSON.stringify({
            twitter: session?.user?.name,
            github: socials.github,
            linkedin: socials.linkedin,
            resume: resume,
          }),
        })
          .then((res) => res.json())
          .then((res: GigResponse) => {
            console.log(res);
            setResponse(res.response);
            setJob(res.companyName, res.companyLogo, res.jobLink, res.jobTitle);
            setStage(GigStages.Message);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [
    stage,
    session,
    resume,
    socials.github,
    socials.linkedin,
    setStage,
    setJob,
  ]);

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
                {fakeLoadingText[currentIndex]}
                {dots}
              </h3>
            );
          case GigStages.Message:
            return (
              <div className="flex w-full max-w-7xl flex-col items-center">
                <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  Message crafted!
                </h3>
                <a href={job.link} target="_blank" rel="noreferrer">
                  <Card>
                    <CardHeader>
                      <div className="flex w-full items-center">
                        <Image
                          src={job.logo}
                          width={48}
                          height={48}
                          className="mr-4 object-cover"
                          alt=""
                        />
                        <div className="flex flex-col">
                          <CardTitle>{job.name}</CardTitle>
                          <CardDescription>{job.link}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
                <blockquote className="my-8 h-80 w-full overflow-y-scroll border-l-2 pl-6 italic">
                  {response}
                </blockquote>
                <CopyToClipboard text={response} onCopy={() => setCopied(true)}>
                  <Button>{copied ? "Copied!" : "Copy to clipboard"}</Button>
                </CopyToClipboard>
              </div>
            );
        }
      })()}

      <div className="absolute bottom-16 flex space-x-8">
        <p className="text-sm text-muted-foreground">Step {stage} of 5</p>
      </div>
    </div>
  );
}
