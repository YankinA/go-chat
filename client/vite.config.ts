import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        rewriteWsOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // '/ws': {
      //   target: 'ws://localhost:8080',
      //   ws: true,
      //   changeOrigin: true,
      //   rewriteWsOrigin: true,
      //   secure: false,
      // },
    },
  },
});

