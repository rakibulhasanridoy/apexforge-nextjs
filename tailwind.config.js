/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './providers/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Iron & Crimson — was { DEFAULT: '#c8f500', dark: '#a8d400', light: '#d4f543' }
        neon: { DEFAULT: '#E63946', dark: '#C92A37', light: '#FF6B74' },
        dark: { bg: '#0a0a0a', card: '#111111', card2: '#161616', border: '#1a1a1a', border2: '#252525' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
