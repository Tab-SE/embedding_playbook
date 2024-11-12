/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{js,jsx,ts,tsx,md,mdx}',
    './src/pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        demoBackground: '#f5f5f4',
        navigationBackground: '#e14462',
        navigationIcons: '#e14462',
        iconBackground: '#f5f5f4',
        metricsPositive: '#e14462',
        metricsNeutral: '#10b981',
        metricsNegative: '#1d4ed8',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@assistant-ui/react/tailwindcss")({ shadcn: true })
  ],
}
