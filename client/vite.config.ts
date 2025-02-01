import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      "/api": "https://techbyte-v1a6.vercel.app"
    }
  },
  plugins: [react()],
})
