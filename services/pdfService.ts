
// By declaring the global, we get type-safety.
declare global {
  interface Window {
    pdfjsLib: any; // The pdfjsLib global object
  }
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) {
    throw new Error("pdf.js library not loaded.");
  }

  // Configure the worker to avoid errors and ensure proper parsing.
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};