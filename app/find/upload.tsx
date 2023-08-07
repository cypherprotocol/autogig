"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserStore, { BotStages } from "@/state/user/useUserStore";
import va from "@vercel/analytics";
import { FileCheck, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setGithub = useUserStore((state) => state.setGithub);
  const setStage = useUserStore((state) => state.setStage);
  const setResume = useUserStore((state) => state.setResume);
  const resume = useUserStore((state) => state.resume);
  const portfolio = useUserStore((state) => state.portfolio);
  const github = useUserStore((state) => state.github);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [option, setOption] = useState<"portfolio" | "resume" | "github">(
    "resume"
  );

  const onSubmit = () => {
    if (resume || portfolio || github) {
      if (resume) {
        va.track("resume-upload");
      }

      if (portfolio) {
        va.track("portfolio-upload");
        const urlPattern = /^(https?:\/\/)/;
        if (!urlPattern.test(portfolio)) {
          setIsValidLink(false);
          return;
        }
        setIsValidLink(true);
      }

      if (github) {
        va.track("github-upload");
      }

      setStage(BotStages.FindJob);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setResume(acceptedFiles?.[0]);
    // Do something with the files
    setIsFileUploaded(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <Card className="relative w-full">
        <Image
          src="/fullcolor-retro-dudes-file.svg"
          width={200}
          height={200}
          alt=""
          className="absolute -right-16 -top-16"
        />
        <CardHeader>
          <CardTitle className="text-2xl">Upload resume</CardTitle>
          <CardDescription>
            We need to know a little bit about you before we can start looking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {!isFileUploaded ? (
              <div
                className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-8"
                {...getRootProps()}
              >
                <input
                  {...getInputProps()}
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept=".txt, .pdf"
                />
                <div className="pointer-events-none mb-4 flex flex-col items-center">
                  <UploadIcon className="mb-4" />
                  {isDragActive ? (
                    <p>Drop here...</p>
                  ) : (
                    <p className="font-medium">
                      Choose a file or drag & drop here
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    PDF or TXT format, up to 10mb.
                  </p>
                </div>
                <Button variant={"outline"}>Browse files</Button>
              </div>
            ) : (
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertTitle>File uploaded!</AlertTitle>
                <AlertDescription>{resume?.name}</AlertDescription>
              </Alert>
            )}
          </>
          {/* {option === "portfolio" && (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="portfolio">Portfolio link</Label>
                <Input
                  className="mt-4 w-full"
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://example.com"
                />
                {!isValidLink && (
                  <Label
                    htmlFor="portfolio"
                    className="flex flex-row items-center space-x-1 text-red-600"
                  >
                    <AlertCircle className="scale-75" />
                    <p>Invalid link please try again </p>
                  </Label>
                )}
              </div>
            </form>
          )} */}
          {/* <div className="mt-4 flex flex-col space-y-1.5">
            <Label htmlFor="github">Github username</Label>
            <Input
              className="mt-4 w-full"
              onChange={(e) => setGithub(e.target.value)}
              placeholder="Username"
            />
          </div> */}

          <Button
            onClick={onSubmit}
            disabled={!isFileUploaded}
            className="mt-4 w-full"
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
