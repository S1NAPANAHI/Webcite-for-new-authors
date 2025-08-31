import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      // Explicitly include only the src directory of the UI package
      include: [resolve(__dirname, 'src')],
    }),
  ],
  optimizeDeps: {
    exclude: ['@zoroaster/shared'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ZoroasterUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', '@zoroaster/shared'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
      {
        find: '@/lib',
        replacement: resolve(__dirname, './src/lib'),
      },
      {
        find: '@zoroaster/ui',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});