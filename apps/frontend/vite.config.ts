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
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@zoroaster/ui': path.resolve(__dirname, '../../packages/ui'),
        '@zoroaster/shared': path.resolve(__dirname, '../../packages/shared'),
        'lexical': path.resolve(__dirname, 'node_modules/lexical'),
        '@lexical/react': path.resolve(__dirname, 'node_modules/@lexical/react'),
        'quill': path.resolve(__dirname, 'node_modules/quill'),
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