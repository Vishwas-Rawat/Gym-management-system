import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    global: 'window', // Polyfill global for sockjs-client
  },
  server: {
    proxy: {
      '/chat': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        ws: true,
      },
      '/attendance': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
})
