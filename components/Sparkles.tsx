import React, { useMemo } from 'react';

const SparkleIcon: React.FC<{className?: string; style?: React.CSSProperties}> = ({className, style}) => (
    <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
        <path d="M9 0L11.0208 7.97917L18 10.5L11.0208 13.0208L9 21L6.97917 13.0208L0 10.5L6.97917 7.97917L9 0Z" fill="url(#paint0_linear_2_2)"/>
        <defs>
            <linearGradient id="paint0_linear_2_2" x1="9" y1="0" x2="9" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F8F7F3"/>
                <stop offset="1" stopColor="#8E8D88"/>
            </linearGradient>
        </defs>
    </svg>
);

interface SparklesProps {
  count?: number;
}

const Sparkles: React.FC<SparklesProps> = ({ count = 10 }) => {
  const sparkleData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${1.5 + Math.random() * 1.5}s`,
      scale: 0.5 + Math.random() * 0.7
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {sparkleData.map((style, index) => (
        <SparkleIcon
          key={index}
          className="absolute animate-sparkle"
          style={{ 
            top: style.top, 
            left: style.left, 
            animationDelay: style.animationDelay, 
            animationDuration: style.animationDuration,
            transform: `scale(${style.scale})`
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;