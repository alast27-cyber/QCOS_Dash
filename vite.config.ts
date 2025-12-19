import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            // Splits large libraries into separate files to fix the 500kB warning
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('recharts')) return 'vendor-recharts';
                if (id.includes('react')) return 'vendor-react';
                return 'vendor';
              }
            }
          }
        },
        chunkSizeWarningLimit: 1000
      }
    };
});