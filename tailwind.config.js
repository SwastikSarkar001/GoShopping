/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      lg: '1100px'
    },
    extend: {
      fontFamily: {
        'roboto-flex': ['Roboto Flex', 'sans-serif'],
        'noto-serif': ['Noto Serif Display', 'sans-serif'],
        'source-serif': ["\"Source Serif 4\"", 'sans-serif'],
        'texturina': ['Texturina', 'sans-serif']
      },
      colors: {
        background: 'rgb(var(--background))'
      }
    },
  },
  plugins: [],
}

