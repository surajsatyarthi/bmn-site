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
        'bmn-blue': '#0047FF', // Vibrant BMN Blue (Reference Match)
        'bmn-navy': '#0f172a', // Navy
        'bmn-sky': '#38bdf8',  // Sky Blue
        'bmn-light-bg': '#f8fafc', // Slate 50
        'bmn-border': '#e2e8f0',   // Slate 200
        'text-primary': '#1e293b', // Slate 800
        'text-secondary': '#64748b', // Slate 500
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
