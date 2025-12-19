/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // La sintaxis <alpha-value> es necesaria para usar opacidad: text-primary/50
        primary: '',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
          blue: {
            500: '#3b82f6',
            700: '#1d4ed8',
          },
      },
    },
  },
  plugins: [],
}