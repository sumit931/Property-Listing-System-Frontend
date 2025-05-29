import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Explicitly setting port, though usually default
    proxy: {
      // Proxy for /auth requests
      '/auth': {
        target: 'http://localhost:3000', // Your backend server for auth
        changeOrigin: true,
        secure: false, // If backend is not HTTPS
      },
      // Proxy for /api requests (for property listings, etc.)
      '/api': {
        target: 'http://localhost:3000', // Your backend server for API
        changeOrigin: true,
        secure: false, // If backend is not HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before sending to backend
      }
    }
  }
})
