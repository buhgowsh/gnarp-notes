
import React, { useState } from 'react';
import { Flashcard } from '@/lib/types';
import { createPowerPoint } from '@/lib/pptx';

interface FlashcardViewerProps {
  cards: Flashcard[];
  fileName: string;
  onReset: () => void;
}
const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ cards, fileName, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => (prev + 1) % cards.length), 150);
  };
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length), 150);
  };
  
  const handleDownload = async () => {
      try {
          await createPowerPoint(cards, fileName);
      } catch (error) {
          console.error(error);
          const message = error instanceof Error ? error.message : "Could not create PowerPoint file. Please try again.";
          alert(message);
      }
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 flex flex-col items-center">
      <p className="text-center text-purple-300 mb-2 sm:mb-4 text-sm sm:text-base">Generated {cards.length} cards! Click to flip.</p>
      
      <div className="relative w-full max-w-3xl h-64 sm:h-80 mb-4 flex justify-center items-center">
        <button
          onClick={handlePrev}
          className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 bg-purple-600/40 text-white rounded-full p-1 sm:p-2 hover:bg-purple-700 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-full max-w-2xl h-full perspective-1000">
          <div 
            className={`card w-full h-full relative cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="card-face rounded-xl bg-slate-800/50 border-2 border-cyan-400 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-center items-center shadow-2xl shadow-cyan-500/20">
              <p className="text-sm text-cyan-300 mb-2">Question</p>
              <p className="text-white text-lg sm:text-xl text-center font-semibold">{currentCard.question}</p>
            </div>
            {/* Back */}
            <div className="card-face card-face--back rounded-xl bg-slate-800/50 border-2 border-green-400 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-center items-center shadow-2xl shadow-green-500/20">
              <p className="text-sm text-green-300 mb-2">Answer</p>
              <p className="text-white text-base sm:text-lg text-center">{currentCard.answer}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 bg-purple-600/40 text-white rounded-full p-1 sm:p-2 hover:bg-purple-700 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-white my-2 text-sm sm:text-base">{currentIndex + 1} / {cards.length}</p>

      <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
        <button onClick={handleDownload} className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Download PPTX</button>
        <button onClick={onReset} className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Start Over</button>
      </div>
    </div>
  );
};

export default FlashcardViewer;