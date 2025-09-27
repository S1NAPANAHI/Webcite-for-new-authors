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
        // CRITICAL: Force single React instance across all packages
        { find: 'react', replacement: path.resolve(__dirname, '../../node_modules/react') },
        { find: 'react-dom', replacement: path.resolve(__dirname, '../../node_modules/react-dom') },
        { find: '@zoroaster/ui/styles.css', replacement: path.resolve(__dirname, '../../packages/ui/dist/style.css') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      preserveSymlinks: false,
      // CRITICAL FIX: Force React deduplication
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        // CRITICAL: Force these into the same bundle to prevent hook errors
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',
        '@supabase/supabase-js',
        '@tanstack/react-query',
        'framer-motion',
        'lucide-react'
      ],
      exclude: ['@zoroaster/shared'],
      // CRITICAL FIX: Force single React instance in dependencies
      force: true,
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
          // CRITICAL FIX: Manual chunking to ensure single React instance
          manualChunks: (id) => {
            // CRITICAL: Always put React in the vendor chunk to prevent duplicates
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            
            // Supabase (separate chunk to avoid conflicts)
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }
            
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            
            // UI Libraries (largest components)
            if (id.includes('@nextui-org/react') || id.includes('framer-motion')) {
              return 'ui-heavy';
            }
            
            // Editor (massive bundle - separate it)
            if (id.includes('react-quill') || 
                id.includes('quill') ||
                id.includes('@tiptap/')) {
              return 'editor';
            }
            
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Utilities
            if (id.includes('clsx') || 
                id.includes('tailwind-merge') ||
                id.includes('class-variance-authority')) {
              return 'utils';
            }
            
            // Default vendor chunk for large node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // Ensure proper chunk naming
          chunkFileNames: (chunkInfo) => {
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        },
      },
    },
  };
});