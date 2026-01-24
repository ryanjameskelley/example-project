import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// HMR configured for subdomain: cmkrlh1ao00015q0d6hebgcxk.preview.auui.ai
export default defineConfig({
  plugins: [react()],
  base: '/',  // No path prefix with subdomain routing
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    strictPort: false,
    hmr: {
      clientPort: 443,
    },
  },
})
