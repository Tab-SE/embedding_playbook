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
        "sfneutral": "#444444",
        "sfneutral95": "#f3f3f3",
        "sfneutral80": "#c9c9c9",
        "sfneutral10": "#181818",
        "sfblue": "#085cab",
        "sfblue50": "#0176d3",
        "sfcloud": "#0d9dda",
        "sfteal": "#04e1cb",
        "sfgreen": "#41b658",
        "sfyellow": "#fcc003",
        "sforange": "#fe9339",
        "sfindigo": "#5867e8",
        "sfviolet": "#730394",
        "sfpink": "#ff538a",
        "sferror": "#fe5c4c",      
      }
    },
  },
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

