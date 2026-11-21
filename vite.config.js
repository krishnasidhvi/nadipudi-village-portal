import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.js.org/config/
export default defineConfig({
  plugins: [react()],
  base: '/nadipudi-village-portal/',
  build: {
    // The 3D map library is one large chunk by design; it is only downloaded
    // when someone opens the 3D view.
    chunkSizeWarningLimit: 1200,
  },
})
