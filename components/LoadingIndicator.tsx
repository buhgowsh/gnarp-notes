import React from 'react';

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

export default LoadingIndicator;
