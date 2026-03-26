/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d8ebff',
          200: '#b9dbff',
          300: '#89c2ff',
          400: '#4da0ff',
          500: '#1f7cff',
          600: '#0f5fd6',
          700: '#124ca9',
          800: '#163f87',
          900: '#17376f',
        },
        ink: '#0f172a',
        sand: '#f7f3eb',
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 60px rgba(31, 124, 255, 0.16)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at top left, rgba(31,124,255,0.18), transparent 34%), radial-gradient(circle at top right, rgba(20,184,166,0.18), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 48%, #f7f3eb 100%)',
      },
    },
  },
  plugins: [],
}
