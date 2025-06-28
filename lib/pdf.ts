'use client';

// Declare pdfjsLib on the window object for TypeScript
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

/**
 * Waits for the pdf.js library to be available on the window object.
 * @param timeout The maximum time to wait in milliseconds.
 * @returns A promise that resolves when the library is loaded.
 */
const ensurePdfJsIsLoaded = (timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      return resolve();
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.pdfjsLib) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error("pdf.js library failed to load within the timeout period. Check the Script tag in layout.tsx."));
      }
    }, 100);
  });
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  await ensurePdfJsIsLoaded();
  const pdfjsLib = window.pdfjsLib;
  
  // Configure the worker to use the CDN version
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
