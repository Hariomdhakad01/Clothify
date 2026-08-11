import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
    proxy:{
      "/api":{
        target: "https://clothify-1o6d.onrender.com/",
        // target: "http://127.0.0.1:3000",
        secure: false,
        changeOrigin: true,
      },
      "/uploads":{
        // target: "http://127.0.0.1:3000",
        target: "https://clothify-1o6d.onrender.com/",
        secure: false,
        changeOrigin: true,
      }
    }
  }
})
