import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const API_BASE_URL = import.meta.env.MODE === 'development'
  ? '/api'
  : 'https://money-talks-bfcb.vercel.app/api';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://money-talks-bfcb.vercel.app',
    },
  }
})
