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
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import { FileText, Link, UploadIcon } from "lucide-react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setSocials = useUserStore((state) => state.setSocials);
  const setResume = useUserStore((state) => state.setResume);
  const setPortfolio = useUserStore((state) => state.setPortfolio);
  const setStage = useUserStore((state) => state.setStage);
  const resume = useUserStore((state) => state.resume);
  const portfolio = useUserStore((state) => state.portfolio);

  const [option, setOption] = useState<"portfolio" | "resume">("resume");

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;
    if (!file) return;

    if (file.type === "application/pdf") {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const data = reader.result;
        const content = await loadPDF(data as ArrayBuffer);

        extractSocials(content);
        setResume(content);
      };
    } else {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const content = e.target?.result;

        if (typeof content !== "string") return;

        extractSocials(content);
        setResume(content);
      };
    }
  };

  const extractSocials = (content: string) => {
    const githubRegex = /github\.com\/([a-zA-Z0-9]+)/g;
    const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/g;

    const githubUsernames = Array.from(
      content.matchAll(githubRegex),
      (match) => match[1]
    );
    const linkedinUsernames = Array.from(
      content.matchAll(linkedinRegex),
      (match) => match[1]
    );

    const githubUsername = githubUsernames[0];
    const linkedinUsername = linkedinUsernames[0];

    console.log("GitHub Username:", githubUsername);
    console.log("LinkedIn Username:", linkedinUsername);

    setSocials({
      github: githubUsername,
      linkedin: linkedinUsername,
    });
  };

  const onSubmit = () => {
    if (resume || portfolio) {
      setStage(GigStages.FindJob);
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
    uploadPhoto({
      target: {
        files: acceptedFiles,
      },
    } as any);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  console.log("option", option);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
          <CardDescription>Upload your resume or portfolio</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <RadioGroup
            defaultValue={option}
            onValueChange={(value) => setOption(value as any)}
            className="mb-4 grid grid-cols-2 gap-4"
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
          </RadioGroup>
          {option === "resume" && (
            <div
              className="flex w-full flex-col items-center justify-center rounded-md border border-dashed py-4"
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
                  <p>Drop the files here...</p>
                ) : (
                  <p>Drag and drop resume to upload</p>
                )}
              </div>
              <Button className="mb-2" onClick={handleFileClick}>
                Select file
              </Button>
              <p className="text-sm text-muted-foreground">PDF or TXT</p>
            </div>
          )}
          {option === "portfolio" && (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="portfolio">Portfolio link</Label>
              <Input
                className="mt-4 w-full"
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}
          <Button onClick={onSubmit} className="mt-4 w-full">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
