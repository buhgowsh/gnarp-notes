
'use client';

import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// Set the workerSrc to a reliable CDN. This is required for the library to work correctly in a bundled environment like Next.js.
// Using the library's version dynamically ensures compatibility.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument(arrayBuffer);
  const pdf: PDFDocumentProxy = await loadingTask.promise;
  
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
    page.cleanup(); // Clean up page resources to save memory
  }

  pdf.destroy(); // Destroy the PDF document object to release memory

  return fullText;
};