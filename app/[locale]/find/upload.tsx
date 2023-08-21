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
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
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
    // Do something with the files
    setIsFileUploaded(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
            className="absolute right-0 -top-8 hidden md:block"
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
                    <Button variant={"outline"}>{t("upload.button")}</Button>
                  </div>
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
