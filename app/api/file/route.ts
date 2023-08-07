import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const loader = new PDFLoader(formData.get("resume") as File, {
    splitPages: false,
    // pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
  });
  const resume = await loader.load();

  return new Response(
    JSON.stringify({
      resume: resume?.[0].pageContent,
    })
  );
}
