"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "@/components/upload";
import { Job } from "@/lib/types";
import useUserStore, { BotStages } from "@/state/user/useUserStore";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BotResponse {
  jobs: Job[];
}

export default function Home() {
  const [dots, setDots] = useState(".");
  const stage = useUserStore((state) => state.stage);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);
  const jobs = useUserStore((state) => state.jobs);
  const setJobs = useUserStore((state) => state.setJobs);
  const portfolio = useUserStore((state) => state.portfolio);
  const github = useUserStore((state) => state.github);
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tip, setTip] = useState<string | undefined>();

  const fakeLoadingText = [
    "Analyzing your profile",
    "Kissing some ass",
    "Adding some perfume",
    "Boom, done",
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
    if (stage === BotStages.FindJob) {
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
    if (stage === BotStages.FindJob) {
      (async function findGig() {
        await fetch("/api/tip?", {
          method: "POST",
          body: JSON.stringify({
            github: github,
            resume: resume,
            portfolio: portfolio,
          }),
        })
          .then((res) => res.json())
          .then((res) => setTip(res.tip));
        const res = await fetch("/api/gig?", {
          method: "POST",
          body: JSON.stringify({
            github: github,
            resume: resume,
            portfolio: portfolio,
          }),
        })
          .then((res) => res.json())
          .then((res: BotResponse) => {
            console.log(res);
            setJobs(res.jobs);
            setTip(undefined);
            setStage(BotStages.Message);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [stage, resume, github, setStage, setJobs]);

  // useEffect(() => {
  //   if (session) {
  //     setStage(BotStages.UploadResume);
  //   }

  //   // Add contain github/twitter
  // }, [session]);

  return (
    <div className="flex w-full max-w-3xl grow flex-col items-center justify-center px-4">
      {(() => {
        switch (stage) {
          case BotStages.UploadResume:
            return <Upload />;
          case BotStages.FindJob:
            return (
              <>
                <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  {fakeLoadingText[currentIndex]}
                  {dots}
                </h3>
                {tip && (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Quick tip</AlertTitle>
                    <AlertDescription>{tip}</AlertDescription>
                  </Alert>
                )}
              </>
            );
          case BotStages.Message:
            return (
              <div className="flex w-full max-w-7xl flex-col items-center">
                <h3 className="mb-4 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                  Here are some gigs we found for you 🎉
                </h3>
                <p className="mb-8 text-sm text-muted-foreground">
                  We have sent your profile to these companies. Check your email
                  for updates.
                </p>

                <Tabs
                  defaultValue={"0"}
                  className="flex w-full flex-col items-center"
                >
                  <TabsList>
                    {jobs.map((job, index) => {
                      return (
                        <TabsTrigger key={index} value={index.toString()}>
                          {job.data.company_name}
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
                      <Card>
                        <CardHeader>
                          <div className="flex w-full items-center">
                            <div className="relative mr-4 h-12 w-12 shrink-0">
                              <Image
                                src={"/robot.png"}
                                fill
                                className="object-contain"
                                alt=""
                              />
                            </div>
                            <div className="flex flex-col truncate">
                              <CardTitle>{job.data.company_name}</CardTitle>
                              <CardDescription>
                                {job.data.title}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
                <Button
                  className="mt-8"
                  onClick={() => setStage(BotStages.UploadResume)}
                >
                  Start over
                </Button>
              </div>
            );
        }
      })()}
    </div>
  );
}
