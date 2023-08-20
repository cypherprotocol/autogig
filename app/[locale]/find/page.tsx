"use client";

import { Upload } from "@/app/[locale]/find/upload";
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
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
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
  const githubForm = useUserStore((state) => state.githubForm);
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tip, setTip] = useState<string | undefined>();
  const [numRuns, setNumRuns] = useState(0);
  const t = useTranslations("Loading");
  const tm = useTranslations("Message");
  const [isError, setIsError] = useState(false);
  const posthog = usePostHog();

  const fakeLoadingText = [
    t("messages.loading-1"),
    t("messages.loading-2"),
    t("messages.loading-3"),
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
    if (stage === BotStages.FindJob && (resume || githubForm)) {
      (async function findGig() {
        let res;
        if (resume) {
          const formData = new FormData();
          formData.set("resume", resume, resume?.name);
          console.log(resume);
          res = await fetch("/api/file", {
            method: "POST",
            body: formData,
          }).then((res) => res.json());
        }

        const [tipResponse, findResponse] = await Promise.all([
          fetch("/api/tip", {
            method: "POST",
            body: JSON.stringify({
              resume: res && res.resume,
              githubForm: githubForm,
            }),
          })
            .then((res) => res.json())
            .then((res) => setTip(res.tip)),
          fetch("/api/find", {
            method: "POST",
            body: JSON.stringify({
              resume: res && res.resume,
              githubForm: githubForm,
            }),
          })
            .then((res) => res.json())
            .then((res: BotResponse) => {
              console.log(res);
              setIsError(false);
              setJobs(res.jobs);
              setTip(undefined);
              setNumRuns(res.numRuns);
              setStage(BotStages.Message);
              setCurrentIndex(0);
            })
            .catch((err) => {
              setStage(BotStages.Message);
              setIsError(true);
            }),
        ]);
      })();
    }
  }, [stage, resume, githubForm, setStage, setJobs]);

  return (
    <div className="flex w-full max-w-3xl grow flex-col items-center justify-start px-4 py-8 md:py-20">
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
                {isError ? (
                  <>
                    <h3 className="mb-8 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                      There was an error with your resume. Please try again.
                    </h3>
                    <Button
                      onClick={() => {
                        setStage(BotStages.UploadResume);
                        setIsError(false);
                      }}
                      className="mt-4"
                    >
                      Try again
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="mb-8 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                      {numRuns >= 1 ? tm("title.run-2") : tm("title.run")}
                    </h3>
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
                              <div className="flex w-full flex-col">
                                <CardTitle>{job.company_name}</CardTitle>
                                <CardDescription>{job.title}</CardDescription>
                              </div>
                              {/* <div className="flex items-center">
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#5c5bee]">
                              {index === 0
                                ? "$75,000"
                                : index === 1
                                ? "$125,000"
                                : "$110,000"}
                            </h4>
                            <p className="ml-1 text-sm text-muted-foreground">
                              /yr
                            </p>
                          </div> */}
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                      <Card>
                        <CardHeader>
                          <div className="flex w-full items-center">
                            <div className="flex w-full flex-col">
                              <CardTitle>+ 18 more</CardTitle>
                              <CardDescription>Great matches</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                    <p className="mt-8 text-sm text-muted-foreground">
                      {tm("description")}
                    </p>
                    <Link
                      href="/contact"
                      onClick={() => {
                        posthog.capture("contact_us");
                      }}
                    >
                      <Button className="mt-4">{tm("button")}</Button>
                    </Link>
                  </>
                )}
              </div>
            );
        }
      })()}
    </div>
  );
}
