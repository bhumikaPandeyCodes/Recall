import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import dotenv from 'dotenv'
// import 'dotenv/config'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL), 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

