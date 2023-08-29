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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formSchema } from "@/lib/types";
import useUserStore, { BotStages } from "@/state/user/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck, FileText, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setStage = useUserStore((state) => state.setStage);
  const setResume = useUserStore((state) => state.setResume);
  const resume = useUserStore((state) => state.resume);
  const portfolio = useUserStore((state) => state.portfolio);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [option, setOption] = useState<"portfolio" | "resume" | "github">(
    "resume"
  );

  const onDrop = useCallback((acceptedFiles) => {
    setResume(acceptedFiles?.[0]);
    console.log(acceptedFiles);
    // Do something with the files
    setIsFileUploaded(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    // noKeyboard: true,
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const formValues = form.watch();

  const onSubmit = () => {
    if (resume || formValues.username) {
      setStage(BotStages.FindJob);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <Card className="relative w-full">
        <CardHeader className="relative">
          <CardTitle className="text-2xl">
            Hey there, please tell me about yourself
          </CardTitle>
          <CardDescription>
            We need to know a little bit about you before we can start looking
          </CardDescription>
          <Image
            src="/fullcolor-retro-dudes-file.svg"
            width={160}
            height={160}
            alt=""
            className="absolute -top-8 right-0 hidden md:block"
          />
        </CardHeader>
        <CardContent>
          <>
            <RadioGroup
              defaultValue={option}
              onValueChange={(value) => setOption(value as any)}
              className="mb-4 grid grid-cols-1 gap-4 md:grid-rows-none"
            >
              <Label
                htmlFor="resume"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value="resume"
                  id="resume"
                  className="sr-only"
                />
                <FileText className="mb-4 h-12 w-12" />
                Resume
              </Label>
              {/* <Label
                htmlFor="github"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value="github"
                  id="github"
                  className="sr-only"
                />
                <Github className="mb-4 h-12 w-12" />
                {t("choices.github")}
              </Label> */}
              {/* <Label
                htmlFor="portfolio"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  disabled
                  value="portfolio"
                  id="portfolio"
                  className="sr-only"
                />
                <Link className="mb-4 h-12 w-12" />
                Portfolio
              </Label> */}
            </RadioGroup>
            <>
              {!isFileUploaded ? (
                <>
                  {isMobile ? (
                    <Input
                      type="file"
                      accept=".txt, .pdf"
                      onChange={(event) => {
                        onDrop(event.target.files);
                      }}
                    />
                  ) : (
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
                  )}
                  {/* <Button
                      type="button"
                      onClick={handleOpenPicker}
                      className="mt-4 w-full"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-4 h-4 w-4 fill-white"
                      >
                        <title>Google Drive</title>
                        <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
                      </svg>
                      Upload from Google Drive
                    </Button> */}
                </>
              ) : (
                <Alert>
                  <FileCheck className="h-4 w-4" />
                  <AlertTitle>File uploaded!</AlertTitle>
                  <AlertDescription>{resume?.name}</AlertDescription>
                </Alert>
              )}
            </>
          </>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={option === "resume" && !isFileUploaded}
            className="mt-4 w-full"
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
