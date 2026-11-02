import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/bangpay-proxy': {
        target: 'https://bangpaysimulator.lovable.app',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/bangpay-proxy/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@audira/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@audira/game-core': path.resolve(__dirname, '../../packages/game-core/src/index.ts'),
    },
  },
});
