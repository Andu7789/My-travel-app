import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/My-travel-app/',
  server: {
    cors: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/cesium')) {
            return 'cesium';
          }
          if (id.includes('node_modules/leaflet')) {
            return 'leaflet';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['cesium', 'leaflet', 'exifreader'],
  },
})
