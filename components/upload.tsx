import { Button } from "@/components/ui/button";
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import { PDFDocumentProxy } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import React, { useRef, useState } from "react";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setSocials = useUserStore((state) => state.setSocials);
  const setResume = useUserStore((state) => state.setResume);
  const setStage = useUserStore((state) => state.setStage);
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;

    setFile(file);

    if (file.type === "application/pdf") {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const data = reader.result;
        loadPDF(data as ArrayBuffer);
      };
    } else {
      const reader = new FileReader();

      if (file) {
        reader.onload = (e) => {
          const content = e.target?.result;

          const githubRegex = /github\.com\/([a-zA-Z0-9]+)/g;
          const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/g;

          if (typeof content === "string") {
            const githubUsernames = Array.from(
              content.matchAll(githubRegex),
              (match) => match[1]
            );
            const linkedinUsernames = Array.from(
              content.matchAll(linkedinRegex),
              (match) => match[1]
            );

            const githubUsername = githubUsernames[0] || null;
            const linkedinUsername = linkedinUsernames[0] || null;

            console.log("GitHub Username:", githubUsername);
            console.log("LinkedIn Username:", linkedinUsername);

            if (githubUsername && linkedinUsername) {
              setSocials(githubUsername, linkedinUsername);
            }

            setResume(content);
            setStage(GigStages.FindJob);
          }
        };

        reader.readAsText(file);
      }
    }
  };

  async function loadPDF(data: ArrayBuffer) {
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

    setResume(result);

    console.log(result);
  }

  async function getPageText(pdf: PDFDocumentProxy, pageNum = 1) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = (textContent.items as TextItem[]).filter((item) =>
      item.str.trim()
    );

    return items.map(({ str }) => str).join("\n\n");
  }

  return (
    <>
      <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Upload your resume
      </h3>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={uploadPhoto}
        ref={fileInputRef}
        accept=".txt, .pdf"
      />
      <Button onClick={handleFileClick} className="mb-2">
        Upload
      </Button>

      <p className="text-sm text-muted-foreground">
        Accept .txt and .pdf files
      </p>
    </>
  );
}
