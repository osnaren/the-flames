/** @type {import('postcss-load-config').Config} */
import { resolve } from 'node:path';

const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    [resolve('scripts/postcss-adaptive-palette.cjs')]: {},
  },
};

export default config;
