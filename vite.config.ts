import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/v1': {
        target: 'https://api.fikriti.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
