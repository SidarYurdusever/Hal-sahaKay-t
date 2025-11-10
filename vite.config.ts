import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path sadece production build için (GitHub Pages)
  base: process.env.NODE_ENV === 'production' ? '/Hal-sahaKay-t/' : '/',
})
