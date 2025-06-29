'use client';

import PptxGenJS from 'pptxgenjs';
import type { Flashcard } from './types';

export const createPowerPoint = async (cards: Flashcard[], title: string): Promise<void> => {
  const pptx = new PptxGenJS();
  
  pptx.author = "Gnarp Notes";
  pptx.title = `Flashcards for ${title}`;

  // Define a starry background to match the app's theme
  const starryNightBackground = { color: "00001a" }; // A very dark blue

  // Function to add decorative stars to a slide
  const addStarsToSlide = (slide: any, isQuestion: boolean) => {
    // Choose colors based on slide type
    const starColor = isQuestion ? "00BFFF" : "32CD32"; // Blue for questions, green for answers
    const glowColor = starColor;

    // Create an array of star positions spread across the entire slide
    // Using inches instead of percentages for more precise positioning
    const starPositions = [
      // Top row
      { x: 1, y: 0.4, w: 0.08, h: 0.08 },
      { x: 3, y: 0.6, w: 0.12, h: 0.12 },
      { x: 5, y: 0.3, w: 0.09, h: 0.09 },
      { x: 7, y: 0.2, w: 0.11, h: 0.11 },
      { x: 9, y: 0.5, w: 0.07, h: 0.07 },
      
      // Upper middle
      { x: 0.5, y: 1.8, w: 0.1, h: 0.1 },
      { x: 2.5, y: 1.6, w: 0.06, h: 0.06 },
      { x: 7.5, y: 2.0, w: 0.09, h: 0.09 },
      { x: 9.2, y: 1.7, w: 0.08, h: 0.08 },
      
      // Middle sections (avoiding central text area 4-6 inches horizontally, 3-5 inches vertically)
      { x: 0.2, y: 3.2, w: 0.09, h: 0.09 },
      { x: 0.4, y: 4.6, w: 0.07, h: 0.07 },
      { x: 9.5, y: 3.0, w: 0.11, h: 0.11 },
      { x: 9.3, y: 4.4, w: 0.08, h: 0.08 },
      
      // Lower middle
      { x: 0.8, y: 5.8, w: 0.1, h: 0.1 },
      { x: 2.8, y: 6.0, w: 0.09, h: 0.09 },
      { x: 7.2, y: 5.9, w: 0.07, h: 0.07 },
      { x: 8.8, y: 6.2, w: 0.12, h: 0.12 },
      
      // Bottom row
      { x: 1.5, y: 6.8, w: 0.08, h: 0.08 },
      { x: 4, y: 6.6, w: 0.06, h: 0.06 },
      { x: 6, y: 6.9, w: 0.09, h: 0.09 },
      { x: 8.5, y: 6.7, w: 0.07, h: 0.07 }
    ];

    starPositions.forEach(star => {
      // Add a star shape using the built-in star shape
      slide.addShape(pptx.ShapeType.star5, {
        x: star.x,
        y: star.y,
        w: star.w,
        h: star.h,
        fill: { color: starColor },
        line: { color: "FFFFFF", width: 1 },
        glow: { size: 8, color: glowColor, opacity: 0.6 }
      });
    });

    // Add smaller twinkling stars spread throughout
    // Using inches for precise positioning across the slide
    const twinkleStars = [
      // Scattered across the entire slide area
      { x: 1.2, y: 1.0, w: 0.025, h: 0.025 },
      { x: 1.8, y: 2.5, w: 0.03, h: 0.03 },
      { x: 2.2, y: 3.9, w: 0.02, h: 0.02 },
      { x: 1.6, y: 5.3, w: 0.035, h: 0.035 },
      { x: 3.5, y: 0.8, w: 0.025, h: 0.025 },
      { x: 3.8, y: 2.3, w: 0.02, h: 0.02 },
      { x: 4.2, y: 4.8, w: 0.03, h: 0.03 },
      { x: 4.5, y: 6.2, w: 0.025, h: 0.025 },
      { x: 5.8, y: 1.3, w: 0.03, h: 0.03 },
      { x: 6.2, y: 2.7, w: 0.025, h: 0.025 },
      { x: 5.5, y: 5.1, w: 0.02, h: 0.02 },
      { x: 6.5, y: 6.5, w: 0.035, h: 0.035 },
      { x: 7.8, y: 1.0, w: 0.025, h: 0.025 },
      { x: 8.2, y: 2.6, w: 0.03, h: 0.03 },
      { x: 8.5, y: 4.0, w: 0.02, h: 0.02 },
      { x: 8.8, y: 5.4, w: 0.025, h: 0.025 }
    ];

    twinkleStars.forEach(star => {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: star.x,
        y: star.y,
        w: star.w,
        h: star.h,
        fill: { color: starColor },
        glow: { size: 5, color: glowColor, opacity: 0.8 }
      });
    });
  };

  cards.forEach(card => {
    // --- Question Slide ---
    let qSlide = pptx.addSlide();
    qSlide.background = starryNightBackground;
    
    // Add stars to the question slide
    addStarsToSlide(qSlide, true);
    
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
    
    // Add stars to the answer slide
    addStarsToSlide(aSlide, false);
    
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