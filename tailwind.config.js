/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eeeeff',
          100: '#d2d4ff',
          200: '#a5a8ff',
          300: '#787cff',
          400: '#4d4dff',
          500: '#2814ff',
          600: '#2010cc',
          700: '#180c99',
        },
        'b-pink': {
          50: '#fdf2f4',
          100: '#f5e6e9',
          200: '#ebc7cd',
          300: '#de9ea9',
          400: '#c77d8a',
          500: '#b87a85',
          600: '#9e5f6a',
        },
        'b-ocre': {
          50: '#fef8f0',
          100: '#fdf0e3',
          200: '#f8dfc0',
          300: '#f2d0a9',
          400: '#ddb87e',
          500: '#c4975e',
          600: '#a47840',
        },
        'b-opal': {
          50: '#f0f7f5',
          100: '#e0eeeb',
          200: '#c2ddd7',
          300: '#99c1b9',
          400: '#72a89d',
          500: '#5f9488',
          600: '#4a776d',
        },
        'b-grey': {
          50: '#f5f5f3',
          100: '#eeedea',
          200: '#e2e0d9',
          300: '#d8d6cd',
          400: '#b5b3a8',
          500: '#8a887e',
          600: '#6b6960',
        },
      },
    },
  },
  plugins: [],
}
