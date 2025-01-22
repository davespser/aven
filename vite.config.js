import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/models/**/*', // Copia todos los archivos en la carpeta models
          dest: 'models',           // Coloca los archivos en dist/models
        },
      ],
    }),
  ],
  base: '/aven/', // Base URL del proyecto
  build: {
    outDir: 'dist', // Carpeta de salida para el build
    emptyOutDir: true, // Limpia la carpeta de salida antes de construir
  },
  assetsInclude: ['**/*.glb'], // Asegura que los archivos GLB sean tratados como activos
});