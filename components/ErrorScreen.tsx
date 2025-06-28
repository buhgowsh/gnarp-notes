import React from 'react';

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

export default ErrorScreen;
