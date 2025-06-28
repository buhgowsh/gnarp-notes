import type { Flashcard } from '../types';

// By declaring the global, we get type-safety and can remove @ts-nocheck.
declare global {
  interface Window {
    PptxGenJS: any; // The PptxGenJS constructor
  }
}

/**
 * Waits for the PptxGenJS library to be available on the window object.
 * @param timeout The maximum time to wait in milliseconds.
 * @returns A promise that resolves when the library is loaded.
 */
const ensurePptxGenJsIsLoaded = (timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.PptxGenJS) {
      return resolve();
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.PptxGenJS) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error("PptxGenJS library failed to load within the timeout period."));
      }
    }, 100);
  });
};


export const createPowerPoint = async (cards: Flashcard[], title: string): Promise<void> => {
  try {
    await ensurePptxGenJsIsLoaded();
  } catch (error) {
    console.error(error);
    throw new Error("PptxGenJS library not loaded. Check your network connection or ad-blocker.");
  }

  const PptxGenJS = window.PptxGenJS;
  const pptx = new PptxGenJS();
  
  pptx.layout = "LAYOUT_WIDE";

  pptx.defineSlideMaster({
    title: "GNARP_QUESTION",
    background: { color: "131842" },
    objects: [
      { text: { text: "Question", options: { x: 0.5, y: 0.25, w: '90%', h: 0.5, fontFace: "Chakra Petch", fontSize: 24, color: "00FFFF", bold: true, align: 'center' } } },
      { line: { x: 0.5, y: 0.8, w: 9.0, h: 0, line: { color: "9A49E8", width: 2 } } },
      { text: { text: "Gnarp Notes", options: { x: 0, y: '95%', w: '100%', h: 0.25, fontFace: "Chakra Petch", fontSize: 10, color: "F1F1F1", align: 'center' } } },
    ],
  });
  
  pptx.defineSlideMaster({
    title: "GNARP_ANSWER",
    background: { color: "131842" },
    objects: [
       { text: { text: "Answer", options: { x: 0.5, y: 0.25, w: '90%', h: 0.5, fontFace: "Chakra Petch", fontSize: 24, color: "32CD32", bold: true, align: 'center' } } },
       { line: { x: 0.5, y: 0.8, w: 9.0, h: 0, line: { color: "9A49E8", width: 2 } } },
       { text: { text: "Gnarp Notes", options: { x: 0, y: '95%', w: '100%', h: 0.25, fontFace: "Chakra Petch", fontSize: 10, color: "F1F1F1", align: 'center' } } },
    ],
  });

  cards.forEach(card => {
    // Question Slide
    const qSlide = pptx.addSlide({ masterName: "GNARP_QUESTION" });
    qSlide.addText(card.question, {
      x: 0.5, y: 1.0, w: '90%', h: '70%',
      fontFace: "Chakra Petch", fontSize: 36, color: "FFFFFF",
      align: 'center', valign: 'middle'
    });
    
    // Answer Slide
    const aSlide = pptx.addSlide({ masterName: "GNARP_ANSWER" });
    aSlide.addText(card.answer, {
      x: 0.5, y: 1.0, w: '90%', h: '70%',
      fontFace: "Chakra Petch", fontSize: 32, color: "FFFFFF",
      align: 'center', valign: 'middle'
    });
  });

  const safeTitle = title.replace(/\.[^/.]+$/, "") || "Gnarp_Notes_Export";
  pptx.writeFile({ fileName: `${safeTitle}.pptx` });
};