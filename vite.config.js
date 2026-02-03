import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    port: 3003,
    hmr: {
      overlay: false
    },
  },
  build: {
    outDir: 'build',    
    sourcemap: false,    
  },
})
