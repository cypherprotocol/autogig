import { Button } from "@/components/ui/button";
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import { UploadIcon } from "lucide-react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setSocials = useUserStore((state) => state.setSocials);
  const setResume = useUserStore((state) => state.setResume);
  const setStage = useUserStore((state) => state.setStage);

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

    setStage(GigStages.FindJob);
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

  return (
    <>
      <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Upload your resume
      </h3>
      <div
        className="flex h-64 w-[32rem] flex-col items-center justify-center rounded-md border border-dashed"
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
        <Button className="mb-4" onClick={handleFileClick}>
          Select file
        </Button>
        <p className="text-sm text-muted-foreground">PDF or TXT</p>
      </div>
    </>
  );
}
