import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'models/*', // Carpeta de modelos
          dest: 'models', // Carpeta destino en dist
        },
      ],
    }),
  ],
  base: '/aven/',
  build: {
    outDir: 'dist',
  },
});