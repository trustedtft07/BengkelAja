/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#5B4FE8',
          dark: '#4840cc',
          light: '#f0eeff',
        },
        orange: {
          DEFAULT: '#FF6B35',
          light: '#fff3ee',
        },
      },
      borderRadius: {
        xl2: '16px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,.07)',
      },
    },
  },
  plugins: [],
}
