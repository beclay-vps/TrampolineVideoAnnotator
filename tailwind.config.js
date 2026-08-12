/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#070a13',
        card: 'rgba(15, 23, 42, 0.75)',
        'card-hover': 'rgba(30, 41, 59, 0.85)',
        border: 'rgba(255, 255, 255, 0.08)',
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glow-sky': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-indigo': '0 0 25px -5px rgba(129, 140, 248, 0.3)',
      }
    },
  },
  plugins: [],
}
