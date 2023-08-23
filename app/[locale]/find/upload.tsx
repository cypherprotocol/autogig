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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formSchema } from "@/lib/types";
import useUserStore, { BotStages } from "@/state/user/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck, FileText, Github, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import useDrivePicker from "react-google-drive-picker";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function Upload() {
  const posthog = usePostHog();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setStage = useUserStore((state) => state.setStage);
  const setResume = useUserStore((state) => state.setResume);
  const resume = useUserStore((state) => state.resume);
  const portfolio = useUserStore((state) => state.portfolio);
  const githubForm = useUserStore((state) => state.githubForm);
  const setGithubForm = useUserStore((state) => state.setGithubForm);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [option, setOption] = useState<"portfolio" | "resume" | "github">(
    "resume"
  );

  const t = useTranslations("Upload");

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
      if (resume) {
        posthog.capture("user_submitted_form_resume");
      } else {
        if (form.formState.isValid) {
          setGithubForm(formValues);
          posthog.capture("user_submitted_form_github");
        }
      }
      setStage(BotStages.FindJob);
      posthog.capture("user_submitted_form");
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

  const [openPicker, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "340519380755-hqpq4uu3svr502kbuudd0p5hkk3as0rq.apps.googleusercontent.com",
      developerKey: "AIzaSyD8DLOQG9agNQiD2lei5EysQqz7tCF1D-g",
      viewId: "PDFS",
      token:
        "ya29.a0AfB_byBK6k15RZSu9mqXGboZ4Rv2mEjfSsP_6gxjFHXM1j090KaMWbuwUD_gBukqE7hrTWTFQIkCX98NMXOw0cVNSCcWZnuawzVliqOZxUq0Q4ed0pZBcxq4fn6lwh9H99Hs47bqE9YT1rjDuEGVZo3nVwpcKczAEEXw5QaCgYKAXoSARMSFQHsvYlsvBvFG14yKtQ5uagw8t8VEA0173", // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }

        if (data?.docs?.[0]?.id) {
          let fileId = data.docs[0].id;
          fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            headers: new Headers({
              Authorization:
                "Bearer " +
                "a0AfB_byBK6k15RZSu9mqXGboZ4Rv2mEjfSsP_6gxjFHXM1j090KaMWbuwUD_gBukqE7hrTWTFQIkCX98NMXOw0cVNSCcWZnuawzVliqOZxUq0Q4ed0pZBcxq4fn6lwh9H99Hs47bqE9YT1rjDuEGVZo3nVwpcKczAEEXw5QaCgYKAXoSARMSFQHsvYlsvBvFG14yKtQ5uagw8t8VEA0173",
            }),
          })
            .then((response) => response.blob())
            .then((blob) => {
              let file = new File([blob], data.docs[0].name, {
                type: "application/pdf",
              });
              console.log(file);
              setResume(file);
              setIsFileUploaded(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <Card className="relative w-full">
        <CardHeader className="relative">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
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
              className="mb-4 grid grid-cols-2 gap-4 md:grid-rows-none"
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
                {t("choices.resume")}
              </Label>
              <Label
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
              </Label>
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
            {option === "resume" ? (
              <>
                {!isFileUploaded ? (
                  <>
                    {isMobile ? (
                      <input
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
                            <p>{t("upload.drag")}</p>
                          ) : (
                            <p className="font-medium">{t("upload.title")}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {t("upload.description")}
                          </p>
                        </div>
                        <Button variant={"outline"}>
                          {t("upload.button")}
                        </Button>
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
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.input-1.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.input-1.placeholder")}
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.input-2.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.input-2.placeholder")}
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.input-3.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.input-3.placeholder")}
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.input-4.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.input-4.placeholder")}
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={
              (option === "resume" && !isFileUploaded) ||
              (option === "github" && !form.formState.isValid)
            }
            className="mt-4 w-full"
          >
            {t("button")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
