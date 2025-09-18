import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    define: {
      global: '{}'
    },
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@zoroaster/shared', replacement: path.resolve(__dirname, '../../packages/shared/src') },
        { find: 'react', replacement: path.resolve(__dirname, '../../node_modules/react') },
        { find: 'react-dom', replacement: path.resolve(__dirname, '../../node_modules/react-dom') },
        { find: '@zoroaster/ui/styles.css', replacement: path.resolve(__dirname, '../../packages/ui/dist/style.css') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      preserveSymlinks: false,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-quill',
        'quill',
        '@tiptap/extension-table',
        '@tiptap/extension-text-style',
        '@tiptap/extension-color',
        '@tiptap/react',
        '@tiptap/starter-kit',
        '@tiptap/extension-image',
        '@tiptap/extension-link',
        '@tiptap/extension-text-align',
        '@tiptap/extension-table-row',
        '@tiptap/extension-table-cell',
        '@tiptap/extension-table-header',
      ],
      exclude: ['@zoroaster/shared'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            quill: ['react-quill', 'quill'],
          },
        },
      },
    },
  };
});