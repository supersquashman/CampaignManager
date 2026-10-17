import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 5173,
    // Dev only: forward /api to the Go server so there's no CORS setup.
    proxy: { '/api': 'http://localhost:8080' },
  },
});
