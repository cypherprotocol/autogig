import pdfjsLib from "pdfjs-dist";

interface TextItem {
  str?: string;
}

export const parsePDF = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
      try {
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;

        const numPages = pdf.numPages;
        let textContent = "";

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const pageTextContent = await page.getTextContent();
          const pageStrings = pageTextContent.items.map((item) => {
            if ("str" in item) {
              return item.str || "";
            }
            return "";
          });
          const pageText = pageStrings.join(" ");
          textContent += pageText;
        }

        resolve(textContent);
      } catch (error) {
        reject(error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
};
