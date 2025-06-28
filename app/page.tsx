
'use client';

import React, { useState, useCallback } from 'react';
import { AppState, Flashcard } from '@/lib/types';
import { extractTextFromPdf } from '@/lib/pdf';
import Gnarpy from '@/components/Gnarpy';
import Sparkles from '@/components/Sparkles';
import LoadingIndicator from '@/components/LoadingIndicator';
import FileUploadScreen from '@/components/FileUploadScreen';
import FlashcardViewer from '@/components/FlashcardViewer';
import ErrorScreen from '@/components/ErrorScreen';


export default function HomePage() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSubmit = useCallback(async (file: File) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    setFileName(file.name);

    try {
      // 1. Extract text on the client
      const text = await extractTextFromPdf(file);
      if(!text.trim()){
        throw new Error("Could not extract any text from the PDF. It might be an image-based file or corrupted.");
      }
      
      // 2. Send text to server-side API route for processing
      const apiResponse = await fetch('/api/generate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
      });
      
      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Failed to generate flashcards from API.');
      }

      const cards: Flashcard[] = data;

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
        return <FileUploadScreen onFileSubmit={handleFileSubmit} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] p-2 sm:p-4 flex items-center justify-center text-white">
      <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
        <div className="absolute inset-0 glitter-border rounded-2xl opacity-50"></div>
        <div className="relative w-full h-full min-h-[90vh] sm:min-h-[80vh] bg-black/30 backdrop-blur-xl rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center">
          <Sparkles count={20} />
          <div className="absolute top-4 left-4 sm:left-6 flex items-center gap-2 sm:gap-3">
              <Gnarpy className="w-8 h-8 sm:w-10 sm:h-10 text-green-400"/>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-widest">GNARP NOTES</h1>
          </div>
          <main className="w-full flex-grow flex items-center justify-center z-10">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};