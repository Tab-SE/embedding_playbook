// /** @type {import('tailwindcss').Config} */

// module.exports = {
//   darkMode: ["class"],
//   content: [
//     './src/app/**/*.{js,jsx,ts,tsx,md,mdx}',
//     './src/pages/**/*.{js,jsx,ts,tsx,md,mdx}',
//     './src/components/**/*.{js,jsx,ts,tsx,md,mdx}',
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         demoBackground: '#f5f5f4',
//         navigationBackground: '#fafaf9',
//         logoBackground: '#fafaf9',
//         navigationIcons: '#0c0a09',
//         iconBackground: '#fafaf9',
//         metricsPositive: '#0284c7',
//         metricsNeutral: '#78716c',
//         metricsNegative: '#ea580c',
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [
//     require("tailwindcss-animate"),
//     require("@assistant-ui/react/tailwindcss")({ shadcn: true })
//   ],
// }

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Keep this, next-themes can work with it via data-theme attribute
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // Replaces demoBackground, navigationBackground, logoBackground, iconBackground if they serve the same purpose
        demoBackground: "hsl(var(--demo-background))", /* contrasts ui components in /demos */
        navBackground: "hsl(var(--nav-background))", /* left hand nav */
        logoBackground: "hsl(var(--logo-background))", /* sometimes logo files are transparent */
        iconBackground: "hsl(var(--icon-background))", /* same with icon having transparent backgrounds */
        loginBackground: "hsl(var(--login-card-background))", /* for the Auth component on login screens */
        navIcons: "hsl(var(--nav-icons))", /* to color icons */
        foreground: "hsl(var(--foreground))", // Replaces navigationIcons potentially
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: { // Good practice for error states
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: { // For subtle elements
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: { // For highlights
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Your specific metric colors (can also use CSS vars if they need to change per theme)
        metricsPositive: 'hsl(var(--metrics-positive))',
        metricsNeutral: 'hsl(var(--metrics-neutral))',
        metricsNegative: 'hsl(var(--metrics-negative))',

        // Add any other semantic colors you need
      },
      borderRadius: { // Often useful alongside color theming
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
    require("@assistant-ui/react/tailwindcss")({ shadcn: true }) // Assumes this plugin works well with CSS variables (most shadcn-based ones do)
  ],
}
