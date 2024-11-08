/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{js,jsx,ts,tsx,md,mdx}',
    './src/pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,md,mdx}',
    './src/utils/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    'text-metricsPositive',
    'text-metricsNeutral',
    'text-metricsNegative',
    'bg-metricsPositive',
    'bg-metricsNeutral',
    'bg-metricsNegative'
  ],
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			demoBackground: '#f5f5f4',
  			navigationBackground: '#fafaf9',
  			navigationIcons: '#0c0a09',
  			metricsPositive: '#0284c7',
  			metricsNeutral: '#78716c',
  			metricsNegative: '#ea580c',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@assistant-ui/react/tailwindcss")({ shadcn: true })
  ],
}
