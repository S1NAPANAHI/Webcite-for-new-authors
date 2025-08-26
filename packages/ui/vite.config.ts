import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '@/lib',
        replacement: path.resolve(__dirname, './src/lib'),
      },
      {
        find: '@zoroaster/ui',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
});
