import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
           // Especifica el archivo exacto
          dest: 'models',           // Directorio destino dentro del build
          flatten: false,           // Conserva la estructura de carpetas original
        },
      ],
    }),
  ],
  base: '/aven/', // Base URL del proyecto
  build: {
    outDir: 'dist', // Carpeta de salida para el build
    emptyOutDir: true, // Limpia la carpeta de salida antes de construir
  },
  assetsInclude: ['**/*.glb'], // Incluye archivos .glb como activos
});