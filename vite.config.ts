import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// HMR configured for Cloudflare tunnel access
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
      // When accessed via Cloudflare tunnel (https://subdomain.preview.auui.ai),
      // the browser derives protocol (wss) and host from page URL.
      // We only need to tell it to connect on port 443.
      clientPort: 443,
    },
  },
})
