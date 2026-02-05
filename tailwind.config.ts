import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bmn-blue': '#2046f5',
        'bmn-dark-blue': '#003366',
        'bmn-orange': '#FF8C00',
        'bmn-light-bg': '#F8F9FA',
        'bmn-border': '#DEE2E6',
        'text-dark': '#212529',
        'text-muted': '#6C757D',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
