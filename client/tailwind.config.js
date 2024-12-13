/** @type {import('tailwindcss').Config} */
import { small, medium, large, xlarge } from './windowSizes'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: small.valInPx,
      md: medium.valInPx,
      lg: large.valInPx,
      xl: xlarge.valInPx
    },
    extend: {
      fontFamily: {
        'roboto-flex': ['Roboto Flex', 'sans-serif'],
        'noto-serif': ['Noto Serif Display', 'sans-serif'],
        'source-serif': ["\"Source Serif 4\"", 'sans-serif'],
        'texturina': ['Texturina', 'sans-serif']
      },
      colors: {
        background: 'rgba(var(--background))',
        text: 'rgba(var(--text))',
        'text-inversed': 'rgba(var(--text-inversed))'
      }
    },
  },
  plugins: [],
}

