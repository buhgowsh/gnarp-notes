import React from 'react';

interface GnarpyProps {
  className?: string;
}

const Gnarpy: React.FC<GnarpyProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 85"
    className={className}
    aria-label="Gnarpy the alien cat mascot"
  >
    <g transform="translate(0, 5)">
      <path d="M49 1C21.9 1 1 20.6 1 46c0 10.2 3.6 19.4 9.5 26.4 1.2 1.4 3.1 1.6 4.5.5 1.4-1.2 1.6-3.1.5-4.5C10.1 62.4 7 54.6 7 46 7 24 26.3 5 49 5s42 19 42 41c0 8.6-3.1 16.4-8.5 22.4-1.2 1.4-.9 3.4.5 4.5 1.4 1.2 3.4.9 4.5-.5C94.4 65.4 98 56.2 98 46 98 20.6 76.1 1 49 1z" fill="#16a34a"/>
      <path d="M49 7.5c-20 0-36.3 16.3-36.3 36.3S29 80 49 80s36.3-16.3 36.3-36.3S69 7.5 49 7.5zm0 68.5c-17.8 0-32.3-14.5-32.3-32.3S31.2 11.5 49 11.5s32.3 14.5 32.3 32.3-14.4 32.2-32.3 32.2z" fill="#15803d"/>
      <ellipse transform="rotate(-15 30 38)" cx="30" cy="38" rx="10" ry="14" fill="#000" />
      <ellipse transform="rotate(15 68 38)" cx="68" cy="38" rx="10" ry="14" fill="#000" />
      <path d="M42 58 C 44 62, 47 62, 49 58 C 51 62, 54 62, 56 58" stroke="#14532d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M37 13c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2s2 .9 2 2v9c0 1.1-.9 2-2 2z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
      <path d="M61 13c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2s2 .9 2 2v9c0 1.1-.9 2-2 2z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />

      <circle cx="37" cy="-2" r="4" fill="#16a34a" stroke="#14532d" strokeWidth="1"/>
      <circle cx="61" cy="-2" r="4" fill="#16a34a" stroke="#14532d" strokeWidth="1"/>
    </g>
  </svg>
);

export default Gnarpy;