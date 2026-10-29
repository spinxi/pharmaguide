/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFDF5',  // Soft Emerald Accent
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#1E7E34', // Primary Brand Green
          700: '#155D27', // Hover Dark Green
          800: '#124B20',
          900: '#0B3315',
          950: '#061D0C',
        },
        clinical: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#1E7E34',
          700: '#155D27',
        },
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        surface: {
          bg: '#F8FAFC', // Soft Background slate-50
          card: '#FFFFFF',
        },
        prescription: {
          amberBg: '#FFFBEB',
          amberBorder: '#FDE68A',
          amberText: '#B45309',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Georgian"', 'Inter', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', '"Noto Sans Georgian"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
