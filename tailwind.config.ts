
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'chakra': ['var(--font-chakra-petch)', 'sans-serif'],
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff' },
          '50%': { textShadow: '0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff' },
        }
      },
      animation: {
        sparkle: 'sparkle 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2.5s linear infinite alternate',
      },
      perspective: {
        '1000': '1000px',
      }
    },
  },
  plugins: [],
};
export default config;
