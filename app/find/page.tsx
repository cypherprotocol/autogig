"use client";

import { Upload } from "@/app/find/upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobData } from "@/lib/types";
import useUserStore, { BotStages } from "@/state/user/useUserStore";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BotResponse {
  numRuns: number;
  jobs: JobData[];
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
  const [numRuns, setNumRuns] = useState(0);

  const fakeLoadingText = [
    "Building your profile",
    "Kissing some ass",
    "Adding some perfume",
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
      }, 5000); // Update every 3  seconds

      return () => {
        clearInterval(intervalId); // Clear interval on unmount
      };
    }
  }, [currentIndex, fakeLoadingText.length, stage]);

  useEffect(() => {
    if (stage === BotStages.FindJob && resume) {
      (async function findGig() {
        const formData = new FormData();
        formData.set("resume", resume, resume?.name);
        console.log(resume);
        const res = await fetch("/api/file", {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        console.log(res);

        const [tipResponse, findResponse] = await Promise.all([
          fetch("/api/tip", {
            method: "POST",
            body: JSON.stringify({
              resume: res.resume,
            }),
          })
            .then((res) => res.json())
            .then((res) => setTip(res.tip)),
          fetch("/api/find", {
            method: "POST",
            body: JSON.stringify({
              resume: res.resume,
            }),
          })
            .then((res) => res.json())
            .then((res: BotResponse) => {
              console.log(res);
              setJobs(res.jobs);
              setTip(undefined);
              setNumRuns(res.numRuns);
              setStage(BotStages.Message);
              setCurrentIndex(0);
            })
            .catch((err) => {
              console.log(err);
            }),
        ]);
      })();
    }
  }, [stage, resume, github, setStage, setJobs]);

  return (
    <div className="flex w-full max-w-3xl grow flex-col items-center justify-center px-4">
      {(() => {
        switch (stage) {
          case BotStages.UploadResume:
            return <Upload />;
          case BotStages.FindJob:
            return (
              <>
                <Image
                  src="/fullcolor-retro-dudes-printer.svg"
                  width={200}
                  height={200}
                  alt=""
                  className="mb-4"
                />
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
                  {numRuns >= 1
                    ? "Enjoy yourself. 👏 We already applied to the following jobs for you."
                    : "Boom, done! Here are some jobs we found for you 🎉"}
                </h3>
                <p className="mb-8 text-sm text-muted-foreground">
                  We have sent your profile to these companies. Check your email
                  for updates.
                </p>
                <div className="flex w-full flex-col space-y-4">
                  {jobs.map((job, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex w-full items-center">
                          <div className="relative mr-4 h-12 w-12 shrink-0">
                            <Image
                              src={
                                job.company_name === "OpenAI"
                                  ? "/logos/openai.svg"
                                  : job.company_name === "ZipRecruiter"
                                  ? "/logos/ziprecruiter.webp"
                                  : "/robot.png"
                              }
                              fill
                              className="rounded-md object-contain"
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col truncate">
                            <CardTitle>{job.company_name}</CardTitle>
                            <CardDescription>{job.title}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

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
