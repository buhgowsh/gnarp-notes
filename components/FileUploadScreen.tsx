import React from 'react';
import Gnarpy from '@/components/Gnarpy';

interface FileUploadScreenProps {
  onFileSubmit: (file: File) => void;
}
const FileUploadScreen: React.FC<FileUploadScreenProps> = ({ onFileSubmit }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

export default FileUploadScreen;
