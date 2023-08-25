import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { nanoid } from "nanoid";

export async function parsePDF(pdf: File): Promise<string> {
  const loader = new PDFLoader(pdf as File, {
    splitPages: false,
    // pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
  });
  const resume = await loader.load();

  const fileName = `${nanoid()}.pdf`;

  return resume?.[0].pageContent;
}
