/** @type {import('tailwindcss').Config} */
const daisyUI = require("daisyui");

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#009ed8",
          "secondary": "#f000b8",
          "accent": "#1dcdbc",  
          "neutral": "#2b3440",
          "base-100": "#ffffff", 
          "info": "#22d3ee",  
          "success": "#36d399",   
          "warning": "#fbbd23",   
          "error": "#f87272",
          "text": "#0f172a",
        },
      },
      "dark",
    ],
  },
  plugins: [
    daisyUI,
  ],
}

