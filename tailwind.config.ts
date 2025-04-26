/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'glow-sm': '0 0 10px -1px rgba(249, 115, 22, 0.2)',
        glow: '0 0 15px -1px rgba(249, 115, 22, 0.3)',
        'glow-lg': '0 0 20px -1px rgba(249, 115, 22, 0.4)',
        'glow-xl': '0 0 25px -1px rgba(249, 115, 22, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'paper-light': "url('https://www.transparenttextures.com/patterns/notebook-dark.png')",
        'paper-dark': "url('https://www.transparenttextures.com/patterns/dark-leather.png')",
        chalkboard: "url('https://www.transparenttextures.com/patterns/black-felt.png')",
      },
    },
  },
  plugins: [],
};

export default config;
