/** @type {import('tailwindcss').Config} */
const daisyUI = require("daisyui");

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "sf-neutral": "#444444",
        "sf-white": "#f3f3f3",
        "sf-neutral-80": "#c9c9c9",
        "sf-neutral-10": "#181818",
        "sf-blue": "#085cab",
        "sf-blue-50": "#0176d3",
        "sf-cloud": "#0d9dda",
        "sf-teal": "#04e1cb",
        "sf-green": "#41b658",
        "sf-yellow": "#fcc003",
        "sf-orange": "#fe9339",
        "sf-indigo": "#5867e8",
        "sf-violet": "#730394",
        "sf-pink": "#ff538a",
        "sf-error": "#fe5c4c",
        "lightning-blue": "#52b7d8",
        "lightning-pink": "#e287b2",
        "lightning-yellow": "#ffb03b",
        "lightning-red": "#e16032",
        "lightning-cyan": "#4fd2d2",
        "lightning-green": "#54a77b",        
      }
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0d9dda",       
          "secondary": "#e16032",     
          "accent": "#04e1cb",  
          "neutral": "#444444",    
          "base-100": "#ffffff",    
          "info": "#0176d3",       
          "success": "#41b658",        
          "warning": "#fcc003",     
          "error": "#fe5c4c",
        },
        dark: {
          "primary": "#0d9dda",       
          "secondary": "#e16032",     
          "accent": "#04e1cb",  
          "neutral": "#444444",    
          "base-100": "#ffffff",    
          "info": "#0176d3",       
          "success": "#41b658",        
          "warning": "#fcc003",     
          "error": "#fe5c4c",
          "backgroundColor": "rgba(17,17,17,var(--tw-bg-opacity))",
        },
      },
    ],
  },
  plugins: [
    daisyUI,
  ],
}

