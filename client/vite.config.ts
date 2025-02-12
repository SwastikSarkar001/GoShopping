import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      'react/compiler-runtime': 'react/jsx-runtime'
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", { target: "18" }],
        ],
      }
    })
  ],
})