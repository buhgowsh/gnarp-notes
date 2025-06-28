
'use client';

import PptxGenJS from 'pptxgenjs';
import type { Flashcard } from './types';

export const createPowerPoint = async (cards: Flashcard[], title: string): Promise<void> => {
  const pptx = new PptxGenJS();
  
  pptx.author = "Gnarp Notes";
  pptx.title = `Flashcards for ${title}`;

  // Define a starry background to match the app's theme
  const starryNightBackground = { color: "00001a" }; // A very dark blue

  cards.forEach(card => {
    // --- Question Slide ---
    let qSlide = pptx.addSlide();
    qSlide.background = starryNightBackground;
    
    qSlide.addText("Question", {
      x: 0.5, y: 0.25, w: "90%", h: 0.75,
      align: 'center',
      fontSize: 18,
      bold: true,
      color: "00BFFF" // Deep Sky Blue for titles
    });
    
    qSlide.addText(card.question, {
      x: 0.5, y: 1.0, w: "90%", h: "75%",
      align: 'center',
      valign: 'middle',
      fontSize: 32,
      color: "FFFFFF", // White for readability
      glow: { size: 10, color: "00BFFF", opacity: 0.7 }
    });

    // --- Answer Slide ---
    let aSlide = pptx.addSlide();
    aSlide.background = starryNightBackground;
    
    aSlide.addText("Answer", {
      x: 0.5, y: 0.25, w: "90%", h: 0.75,
      align: 'center',
      fontSize: 18,
      bold: true,
      color: "32CD32" // Lime Green for titles
    });
    
    aSlide.addText(card.answer, {
      x: 0.5, y: 1.0, w: "90%", h: "75%",
      align: 'center',
      valign: 'middle',
      fontSize: 28,
      color: "FFFFFF",
      glow: { size: 10, color: "32CD32", opacity: 0.7 }
    });
  });

  const safeTitle = title.replace(/\.[^/.]+$/, "") || "Gnarp_Notes_Export";
  pptx.writeFile({ fileName: `${safeTitle}.pptx` });
};