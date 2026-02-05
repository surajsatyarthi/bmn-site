import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bmn-blue': '#2046f5', // Royal Blue (Invoice Reference)
        'bmn-dark-blue': '#003366', // Deep Blue
        'bmn-orange': '#FF8C00', // Warning/Accent
        'bmn-light-bg': '#F8F9FA', // Light Gray Background
        'bmn-border': '#DEE2E6',   // Standard Border
        'text-primary': '#212529', // Dark Slate (Accessibiltiy)
        'text-secondary': '#6C757D', // Muted Text
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'sans-serif'],
      },
      // Added for Modern Aesthetics
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #2046f5, #003366)',
        'gradient-footer': 'linear-gradient(to bottom, #ffffff, #F8F9FA)',
      }
    },
  },
  plugins: [],
};

export default config;
