import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
 // plugins: [react()],

  plugins: [react(), tailwindcss()],
  resolve: {
 alias: { '@': path.resolve(__dirname, './src') },
 },

  server: {
    watch: {

      // JSON Server reescribe db.json en cada alta/edición/baja; sin esto Vite
      // recarga la página completa y los toasts desaparecen al instante.
      ignored: ['**/db.json'],
    },
  },
});
