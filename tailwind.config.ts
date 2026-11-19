import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          50: '#FDF8F6',
          100: '#F9EDE8',
          200: '#F4DCD3',
          300: '#EABFB0',
          400: '#DF9B85',
          500: '#D47355',
          600: '#B85538',
          700: '#944028',
          800: '#753523',
          900: '#5F2D1F',
          950: '#34150D',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#EAB308',
          500: '#CA8A04',
          600: '#A16207',
          700: '#854D0E',
        },
      },
    },
  },
  plugins: [],
};

export default config;
