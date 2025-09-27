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
      global: 'globalThis',
      // Fix Node.js globals for browser environment
      'process.env': {},
      'process.platform': JSON.stringify('browser'),
      'process.version': JSON.stringify('v16.0.0'),
      __SUPABASE__: 'window.supabase'
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

        'react-router-dom',
        '@supabase/supabase-js',
        '@tanstack/react-query',
        'framer-motion',
        'lucide-react'
      ],
      exclude: ['@zoroaster/shared'],
      esbuildOptions: {
        target: 'es2020',
        define: {
          global: 'globalThis'
        }
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
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      target: 'es2020',
      // Critical: Optimize chunk sizes to prevent massive bundles
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: [],
        output: {
          // Critical: Manual chunking to optimize bundle sizes
          manualChunks: {
            // Core React
            'react-vendor': ['react', 'react-dom'],
            
            // Supabase (separate chunk to avoid conflicts)
            'supabase': ['@supabase/supabase-js'],
            
            // React Query
            'query': ['@tanstack/react-query'],
            
            // UI Libraries (largest components)
            'ui-heavy': [
              '@nextui-org/react',
              'framer-motion'
            ],
            
            // Editor (massive bundle - separate it)
            'editor': [
              'react-quill', 
              'quill',
              '@tiptap/react',
              '@tiptap/starter-kit',
              '@tiptap/extension-table',
              '@tiptap/extension-text-style',
              '@tiptap/extension-color',
              '@tiptap/extension-image',
              '@tiptap/extension-link',
              '@tiptap/extension-text-align'
            ],
            
            // Icons
            'icons': ['lucide-react'],
            
            // Utilities
            'utils': [
              'clsx',
              'tailwind-merge',
              'class-variance-authority'
            ]
          },
          // Ensure proper chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId 
              ? chunkInfo.facadeModuleId.split('/').pop() 
              : 'unknown';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        },
      },
    },
  };
});