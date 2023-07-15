"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "@/components/upload";
import { PotentialJob } from "@/lib/types";
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import { Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface GigResponse {
  potentialJobs: PotentialJob[];
}

export default function Home() {
  const [dots, setDots] = useState(".");
  const { data: session, status } = useSession();
  const stage = useUserStore((state) => state.stage);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);
  const jobs = useUserStore((state) => state.jobs);
  const setJobs = useUserStore((state) => state.setJobs);
  const portfolio = useUserStore((state) => state.portfolio);
  const github = useUserStore((state) => state.github);
  const linkedin = useUserStore((state) => state.linkedin);
  const [copied, setCopied] = useState(false);
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
            github: github,
            linkedin: linkedin,
            resume: resume,
            portfolio: portfolio,
          }),
        })
          .then((res) => res.json())
          .then((res: GigResponse) => {
            console.log(res);
            setJobs(res.potentialJobs);
            setStage(GigStages.Message);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [stage, session, resume, github, linkedin, setStage, setJobs]);

  // useEffect(() => {
  //   if (session) {
  //     setStage(GigStages.UploadResume);
  //   }

  //   // Add contain github/twitter
  // }, [session]);

  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
      <div className="flex w-72 items-center justify-center md:w-[24rem] lg:w-[32rem]">
        {(() => {
          switch (stage) {
            case GigStages.Start:
              return (
                <Button onClick={() => setStage(GigStages.UploadResume)}>
                  Find a job
                </Button>
              );
            // case GigStages.LinkTwitter:
            //   return (
            //     <>
            //       <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            //         Link your twitter
            //       </h3>
            //       <Button onClick={() => signIn("twitter")}>Link</Button>
            //     </>
            //   );
            // case GigStages.LinkGithub:
            //   return (
            //     <>
            //       <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            //         Link your github
            //       </h3>
            //       <Button onClick={() => signIn("github")}>Link</Button>
            //     </>
            //   );
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
                  <h3 className="mb-8 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                    Here are some jobs we found for you 🎉
                  </h3>
                  <Tabs
                    defaultValue={"0"}
                    className="flex w-full flex-col items-center"
                  >
                    <TabsList>
                      {jobs.map((job, index) => {
                        return (
                          <TabsTrigger key={index} value={index.toString()}>
                            {job.companyName}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                    {jobs.map((job, index) => (
                      <TabsContent
                        key={index}
                        value={index.toString()}
                        className="w-full"
                      >
                        <a href={job.jobLink} target="_blank" rel="noreferrer">
                          <Card>
                            <CardHeader>
                              <div className="flex w-full items-center">
                                <div className="relative mr-4 h-12 w-12 shrink-0">
                                  <Image
                                    src={job.companyLogo}
                                    fill
                                    className="object-contain"
                                    alt=""
                                  />
                                </div>
                                <div className="flex flex-col truncate">
                                  <CardTitle>{job.companyName}</CardTitle>
                                  <CardDescription>
                                    {job.jobLink}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        </a>
                        <blockquote className="my-8 h-64 max-w-3xl overflow-y-scroll border-l-2 pl-6 pr-2 italic md:h-80">
                          {job.response}
                        </blockquote>
                        <div className="flex w-full flex-row justify-center space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => setStage(0)}
                          >
                            Start Over
                          </Button>
                          <CopyToClipboard
                            text={job.response}
                            onCopy={() => setCopied(true)}
                          >
                            <Button>
                              {copied ? "Copied!" : "Copy to clipboard"}
                              <Copy className="ml-2 h-4 w-4" />
                            </Button>
                          </CopyToClipboard>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              );
          }
        })()}

        <div className="absolute bottom-16 flex space-x-8">
          <p className="text-sm text-muted-foreground">
            Step {stage} of {Object.keys(GigStages).length / 2}
          </p>
        </div>
      </div>
    </div>
  );
}
