import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from frontend directory and fallback to root
  const frontendEnv = loadEnv(mode, __dirname, '');
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '../..'), '');
  const env = { ...rootEnv, ...frontendEnv };

  return {
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        
        { find: 'lexical', replacement: path.resolve(__dirname, '../../node_modules/lexical') },
        { find: '@lexical/react', replacement: path.resolve(__dirname, '../../node_modules/@lexical/react') },
        { find: 'quill', replacement: path.resolve(__dirname, '../../node_modules/quill') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'react-quill', 'quill'],
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
      'import.meta.env': { ...env },
      __APP_ENV__: JSON.stringify(env.NODE_ENV || 'development'),
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