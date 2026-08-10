import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Evitamos que los falsos cambios en .env reinicien el servidor en bucle
      ignored: ['**/.env']
    }
  }
})
