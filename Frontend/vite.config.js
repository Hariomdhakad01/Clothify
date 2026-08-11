import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
    proxy:{
      "/api":{
        target: "https://clothify-1o6d.onrender.com/",
        secure: false,
        changeOrigin: true,
      },
      "/uploads":{
        target: "https://clothify-1o6d.onrender.com/",
        secure: false,
        changeOrigin: true,
      }
    }
  }
})
