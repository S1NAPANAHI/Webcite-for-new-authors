import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react({
      babel: {
        plugins: ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
      },
    })],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@zoroaster/ui', replacement: path.resolve(__dirname, '../../packages/ui/src') },
        { find: '@zoroaster/shared', replacement: path.resolve(__dirname, '../../packages/shared/src') },
        { find: 'lexical', replacement: path.resolve(__dirname, 'node_modules/lexical') },
        { find: '@lexical/react', replacement: path.resolve(__dirname, 'node_modules/@lexical/react') },
        { find: 'quill', replacement: path.resolve(__dirname, 'node_modules/quill') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
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
    define: {
      'process.env': { ...env },
      __APP_ENV__: JSON.stringify(env.NODE_ENV || 'development'),
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-quill',
        'quill'
      ],
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
    build: {
      sourcemap: mode === 'development',
      rollupOptions: {
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