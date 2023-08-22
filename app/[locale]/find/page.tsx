"use client";

import { Upload } from "@/app/[locale]/find/upload";
import Navbar from "@/app/navbar";
import { Gauge } from "@/components/gauge";
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
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

interface BotResponse {
  numRuns: number;
  jobs: JobData[];
  email?: string;
  firstName?: string;
}

export default function Home() {
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
    posthog.capture("find");
  }, [posthog]);

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
            .then(async (res: BotResponse) => {
              console.log(res);
              setIsError(false);
              setJobs(res.jobs);
              setTip(undefined);
              setNumRuns(res.numRuns);
              setStage(BotStages.Message);
              setCurrentIndex(0);

              await fetch("/api/send", {
                method: "POST",
                body: JSON.stringify({
                  email: res?.email,
                  firstName: res?.firstName,
                }),
              });
            })
            .catch((err) => {
              console.log(err);
              setStage(BotStages.Message);
              setIsError(true);
            }),
        ]);
      })();
    }
  }, [stage, resume, githubForm, setStage, setJobs]);

  useEffect(() => {
    if (stage === BotStages.Message) {
      posthog.capture("completed");
    }
  }, [posthog, stage]);

  return (
    <>
      <Navbar />
      <div className="flex w-full max-w-3xl grow flex-col items-center justify-start px-4 pb-16 pt-24 md:pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="flex h-full w-full flex-col items-center justify-start"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
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
                        className=""
                      />
                      <BarLoader color="#5c5bee" className="mt-16" />
                      <AnimatePresence mode="wait">
                        <motion.h3
                          key={fakeLoadingText[currentIndex]}
                          className="mt-4 scroll-m-20 text-2xl font-semibold tracking-tight"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {fakeLoadingText[currentIndex]}
                        </motion.h3>
                      </AnimatePresence>
                      {tip && (
                        <motion.div
                          className="mt-8"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Quick tip</AlertTitle>
                            <AlertDescription>{tip}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </>
                  );
                case BotStages.Message:
                  return (
                    <div className="flex w-full max-w-7xl flex-col items-center">
                      {isError ? (
                        <>
                          <Image
                            src="/fullcolor-retro-dudes-lock.svg"
                            width={200}
                            height={200}
                            alt=""
                            className="mb-4"
                          />
                          <h3 className="mb-8 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                            Whoops, we ran into an error finding your best
                            matches.
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
                          <h3 className="mb-4 scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                            {numRuns >= 1 ? tm("title.run-2") : tm("title.run")}
                          </h3>
                          <p className="mb-8 text-sm text-muted-foreground">
                            {tm("description")}
                            <span className="text-[#5c5bee]">
                              hey@autogig.pro
                            </span>
                          </p>
                          <div className="flex w-full flex-col items-center space-y-4">
                            {jobs.map((job, index) => (
                              <Card key={index} className="w-full">
                                <CardHeader>
                                  <div className="flex w-full items-center">
                                    <div className="relative mr-4 h-12 w-12 shrink-0">
                                      <Image
                                        src={
                                          index === 0
                                            ? "/company_1.jpg"
                                            : index === 1
                                            ? "/company_2.jpg"
                                            : "/company_3.jpg"
                                        }
                                        fill
                                        className="rounded-md object-contain"
                                        alt=""
                                      />
                                    </div>
                                    <div className="flex w-full flex-col">
                                      <CardTitle>{job.company_name}</CardTitle>
                                      <CardDescription>
                                        {job.title}
                                      </CardDescription>
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
                            <p className="text-sm text-[#5c5bee]">
                              + many more great matches
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  );
              }
            })()}
          </motion.div>
        </AnimatePresence>
        {stage !== BotStages.Message && (
          <div className="mt-16 flex  items-center space-x-4">
            <Gauge value={33 * stage} size="small" showValue={false} />
            <p className="text-sm text-muted-foreground">Step {stage} of 3</p>
          </div>
        )}
      </div>
    </>
  );
}
