import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          
          dist: 'models', // Carpeta destino en dist
        },
      ],
    }),
  ],
  base: '/aven/',
  build: {
    outDir: 'dist',
    assetsInclude: ['**/*.glb'], // Incluir los archivos .glb en el proceso de construcción
  },
});