import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // <-- your Node backend port
        changeOrigin: true,
        // If your backend uses cookies/sessions and a different origin, also add:
        // secure: false,
        // ws: true,
      }
    }
  }
})
