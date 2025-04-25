/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px -1px rgba(249, 115, 22, 0.2)',
        'glow': '0 0 15px -1px rgba(249, 115, 22, 0.3)',
        'glow-lg': '0 0 20px -1px rgba(249, 115, 22, 0.4)',
        'glow-xl': '0 0 25px -1px rgba(249, 115, 22, 0.5)',
      },
      fontFamily: {
        'handwriting': ['"Patrick Hand"', 'cursive'],
      },
      backgroundImage: {
        'paper-light': "url('https://www.transparenttextures.com/patterns/notebook-dark.png')",
        'paper-dark': "url('https://www.transparenttextures.com/patterns/dark-leather.png')",
        'chalkboard': "url('https://www.transparenttextures.com/patterns/black-felt.png')",
      }
    },
  },
  plugins: [],
};