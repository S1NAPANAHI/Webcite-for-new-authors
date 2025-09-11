import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from root .env file
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '../../'), '');
  const frontendEnv = loadEnv(mode, __dirname, '');
  const env = { ...rootEnv, ...frontendEnv };

  const definedEnv = {};
  for (const key in env) {
    if (key.startsWith('VITE_')) {
      definedEnv[`import.meta.env.${key}`] = JSON.stringify(env[key]);
      definedEnv[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  }


  return {
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        // Add explicit aliases for react and react-dom
        { find: 'react', replacement: path.resolve(__dirname, '../../node_modules/react') },
        { find: 'react-dom', replacement: path.resolve(__dirname, '../../node_modules/react-dom') },
        
        { find: 'lexical', replacement: path.resolve(__dirname, '../../node_modules/lexical') },
        { find: '@lexical/react', replacement: path.resolve(__dirname, '../../node_modules/@lexical/react') },
        { find: 'quill', replacement: path.resolve(__dirname, '../../node_modules/quill') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      preserveSymlinks: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'react-quill', 'quill'],
      exclude: ['@zoroaster/shared'], // Add this line
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
    define: definedEnv,
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        external: ['@zoroaster/shared'],
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