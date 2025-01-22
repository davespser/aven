import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'models/patio2.glb', // Especifica el archivo exacto
          dest: 'models',
        },
      ],
    }),
  ],
  base: '/aven/',
  build: {
    outDir: 'dist',
  },
  assetsInclude: ['**/*.glb'], // Asegura que los archivos .glb sean tratados como activos
});