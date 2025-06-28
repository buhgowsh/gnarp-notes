import React, { useState, useCallback } from 'react';
import { AppState, Flashcard } from './types';
import { extractTextFromPdf } from './services/pdfService';
import { generateFlashcardsFromText } from './services/geminiService';
import { createPowerPoint } from './services/powerpointService';
import Gnarpy from './components/Gnarpy';
import Sparkles from './components/Sparkles';

// --- Helper Components (defined outside App to prevent re-creation on re-renders) ---

const LoadingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <svg 
      className="w-24 h-24 text-cyan-400 animate-float" 
      viewBox="0 0 100 60" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 10C25 10 10 20 10 30S25 50 50 50 90 40 90 30 75 10 50 10zM50 45C30 45 15 37.5 15 30S30 15 50 15s35 7.5 35 15-15 15-35 15z" opacity="0.5" />
      <path d="M50,0 C66.5685425,0 80,6.71572875 80,15 C80,23.2842712 66.5685425,30 50,30 C33.4314575,30 20,23.2842712 20,15 C20,6.71572875 33.4314575,0 50,0 Z" />
      <ellipse cx="50" cy="30" rx="45" ry="15" fill="currentColor" opacity="0.1" transform="translate(0, 20)"/>
    </svg>
    <p className="mt-6 text-xl text-glow text-cyan-300 animate-pulse">Analyzing document... generating notes...</p>
    <p className="text-sm text-purple-300 mt-2">Gnarpy is working its space magic!</p>
  </div>
);

interface FileUploadScreenProps {
  onFileSubmit: (file: File) => void;
  setIsLoading: (isLoading: boolean) => void;
}
const FileUploadScreen: React.FC<FileUploadScreenProps> = ({ onFileSubmit, setIsLoading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      onFileSubmit(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <Gnarpy className="w-28 h-28 text-green-400 drop-shadow-[0_5px_15px_rgba(74,222,128,0.4)]" />
      <h2 className="text-4xl md:text-5xl font-bold text-glow text-cyan-300 mt-4">Welcome to Gnarp Notes</h2>
      <p className="mt-4 max-w-lg text-purple-200 text-lg">Upload your PDF study materials, and let Gnarpy the alien cat transform them into flashcards from another dimension!</p>
      <label className="mt-8 group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/30 overflow-hidden">
        <span className="absolute left-0 top-0 h-full w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
        <span className="relative z-10">Upload PDF</span>
        <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

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
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      <p className="text-center text-purple-300 mb-4">Generated {cards.length} cards! Click to flip.</p>
      
      <div className="relative w-full max-w-3xl h-80 mb-4 flex justify-center items-center">
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-purple-600/40 text-white rounded-full p-2 hover:bg-purple-700 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-full max-w-2xl h-full perspective-1000">
          <div 
            className={`card w-full h-full relative cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="card-face rounded-xl bg-slate-800/50 border-2 border-cyan-400 backdrop-blur-sm p-6 flex flex-col justify-center items-center shadow-2xl shadow-cyan-500/20">
              <p className="text-sm text-cyan-300 mb-2">Question</p>
              <p className="text-white text-xl text-center font-semibold">{currentCard.question}</p>
            </div>
            {/* Back */}
            <div className="card-face card-face--back rounded-xl bg-slate-800/50 border-2 border-green-400 backdrop-blur-sm p-6 flex flex-col justify-center items-center shadow-2xl shadow-green-500/20">
              <p className="text-sm text-green-300 mb-2">Answer</p>
              <p className="text-white text-lg text-center">{currentCard.answer}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-purple-600/40 text-white rounded-full p-2 hover:bg-purple-700 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-white my-2">{currentIndex + 1} / {cards.length}</p>

      <div className="flex items-center gap-4 mt-4">
        <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Download PPTX</button>
        <button onClick={onReset} className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Start Over</button>
      </div>
    </div>
  );
};

interface ErrorScreenProps {
  message: string | null;
  onReset: () => void;
}
const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onReset }) => (
  <div className="text-center p-8 bg-red-900/30 border border-red-500 rounded-lg">
    <h2 className="text-3xl font-bold text-red-400">Houston, we have a problem!</h2>
    <p className="mt-4 text-red-200">{message || "An unknown error occurred."}</p>
    <button onClick={onReset} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Try Again</button>
  </div>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSubmit = useCallback(async (file: File) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    setFileName(file.name);

    try {
      const text = await extractTextFromPdf(file);
      if(!text.trim()){
        throw new Error("Could not extract any text from the PDF. It might be an image-based file or corrupted.");
      }
      
      const cards = await generateFlashcardsFromText(text);
      if(cards.length === 0){
        throw new Error("Gnarpy couldn't find any content to make flashcards from. Try a different document.");
      }
      
      setFlashcards(cards);
      setAppState(AppState.SHOWING_CARDS);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred during processing.');
      setAppState(AppState.ERROR);
    }
  }, []);
  
  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setFlashcards([]);
    setError(null);
    setFileName('');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <LoadingIndicator />;
      case AppState.SHOWING_CARDS:
        return <FlashcardViewer cards={flashcards} fileName={fileName} onReset={handleReset} />;
      case AppState.ERROR:
        return <ErrorScreen message={error} onReset={handleReset} />;
      case AppState.IDLE:
      default:
        return <FileUploadScreen onFileSubmit={handleFileSubmit} setIsLoading={() => setAppState(AppState.PROCESSING)} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] p-4 flex items-center justify-center font-chakra text-white">
      <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
        <div className="absolute inset-0 glitter-border rounded-2xl opacity-50"></div>
        <div className="relative w-full h-full min-h-[80vh] bg-black/30 backdrop-blur-xl rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center">
          <Sparkles count={20} />
          <div className="absolute top-4 left-6 flex items-center gap-3">
              <Gnarpy className="w-10 h-10 text-green-400"/>
              <h1 className="text-2xl font-bold text-white tracking-widest">GNARP NOTES</h1>
          </div>
          <main className="w-full flex-grow flex items-center justify-center z-10">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;