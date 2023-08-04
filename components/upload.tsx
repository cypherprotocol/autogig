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
import { AlertCircle, FileCheck, UploadIcon } from "lucide-react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setGithub = useUserStore((state) => state.setGithub);
  const setLinkedin = useUserStore((state) => state.setLinkedin);
  const setResume = useUserStore((state) => state.setResume);
  const setPortfolio = useUserStore((state) => state.setPortfolio);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);
  const portfolio = useUserStore((state) => state.portfolio);
  const github = useUserStore((state) => state.github);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [option, setOption] = useState<"portfolio" | "resume" | "github">(
    "resume"
  );

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;
    if (!file) return;

    if (file.type === "application/pdf") {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const data = reader.result;
        const content = await loadPDF(data as ArrayBuffer);

        setResume(content);
      };
    } else {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const content = e.target?.result;

        if (typeof content !== "string") return;

        setResume(content);
      };
    }
  };

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

  async function loadPDF(data: ArrayBuffer): Promise<string> {
    const now = Date.now();

    // const { getDocument } = await import('pdfjs-dist');
    // await import('pdfjs-dist/build/pdf.worker.entry');
    const [{ getDocument }] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.entry"),
    ]);

    console.log("mm-time", Date.now() - now);

    // const pdf = await pdfjsLib.getDocument(data).promise;
    const pdf = await getDocument(data).promise;

    let result = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      result += await getPageText(pdf, i);
    }

    return result;
  }

  async function getPageText(pdf: PDFDocumentProxy, pageNum = 1) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = (textContent.items as TextItem[]).filter((item) =>
      item.str.trim()
    );

    return items.map(({ str }) => str).join("\n\n");
  }

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    upload({
      target: {
        files: acceptedFiles,
      },
    } as any);

    setIsFileUploaded(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Upload resume</CardTitle>
          <CardDescription>
            We need to know a little bit about you before we can start looking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <RadioGroup
            defaultValue={option}
            onValueChange={(value) => setOption(value as any)}
            className="mb-4 grid grid-rows-3 gap-4 md:grid-cols-3 md:grid-rows-none"
          >
            <Label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="resume" id="resume" className="sr-only" />
              <FileText className="mb-4 h-12 w-12" />
              Resume
            </Label>
            <Label
              htmlFor="github"
              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="github" id="github" className="sr-only" />
              <Github className="mb-4 h-12 w-12" />
              Github
            </Label>
            <Label
              htmlFor="portfolio"
              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem
                value="portfolio"
                id="portfolio"
                className="sr-only"
              />
              <Link className="mb-4 h-12 w-12" />
              Portfolio
            </Label>
          </RadioGroup> */}
          {option === "resume" && (
            <>
              {!isFileUploaded ? (
                <div
                  className="flex w-full flex-col items-center justify-center rounded-md border border-dashed p-8"
                  {...getRootProps()}
                >
                  <input
                    {...getInputProps()}
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".txt, .pdf"
                  />
                  <div className="mb-4 flex flex-col items-center">
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
                  <AlertTitle>Resume uploaded!</AlertTitle>
                  <AlertDescription>
                    We will use this information to find you the best jobs.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
          {option === "portfolio" && (
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
          )}
          {option === "github" && (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="github">Github username</Label>
                <Input
                  className="mt-4 w-full"
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="Username"
                />
              </div>
            </form>
          )}
          <Button onClick={onSubmit} className="mt-4 w-full">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
