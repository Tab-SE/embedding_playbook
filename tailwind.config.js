/** @type {import('tailwindcss').Config} */
const daisyUI = require("daisyui");

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  darkMode: 'class',
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0d9dda",       
          "secondary": "#d83a00",     
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
          "secondary": "#d83a00",     
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

