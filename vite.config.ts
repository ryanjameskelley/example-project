import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// HMR configured for subdomain: cml9y9hv5000316242ng4hstb.preview.auui.ai
export default defineConfig({
  plugins: [react()],
  base: '/',
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
