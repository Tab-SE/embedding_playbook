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
  plugins: [
    daisyUI,
  ],
}

