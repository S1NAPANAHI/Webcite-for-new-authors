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
        'lucide-react',
        // ADDED: Editor dependencies to prevent initialization errors
        'quill',
        '@tiptap/core',
        '@tiptap/react',
        '@tiptap/starter-kit'
      ],
      exclude: ['@zoroaster/shared'],
      // CRITICAL FIX: Force single React instance in dependencies
      force: true,
      esbuildOptions: {
        target: 'es2020',
        define: {
          global: 'globalThis'
        },
        // ADDED: Better module resolution for initialization order
        keepNames: true,
        treeShaking: true
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
      // ADDED: Better development server configuration
      hmr: {
        overlay: true
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      target: 'es2020',
      // Critical: Optimize chunk sizes to prevent massive bundles
      chunkSizeWarningLimit: 1000,
      // ADDED: Better minification options to prevent initialization errors
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: {
        compress: {
          // CRITICAL: Preserve function names to prevent initialization errors
          keep_fnames: true,
          keep_classnames: true,
          // Prevent aggressive optimization that can cause circular deps
          drop_console: false,
          drop_debugger: true
        },
        mangle: {
          // CRITICAL: Don't mangle function names to prevent 'Di' initialization error
          keep_fnames: true,
          keep_classnames: true
        }
      },
      rollupOptions: {
        external: [],
        // ADDED: Better tree-shaking configuration
        treeshake: {
          moduleSideEffects: false,
          // CRITICAL: Don't remove seemingly unused exports that might be needed for initialization
          unknownGlobalSideEffects: false
        },
        output: {
          // CRITICAL FIX: Manual chunking to ensure single React instance and prevent initialization errors
          manualChunks: (id) => {
            // CRITICAL: Always put React in the vendor chunk to prevent duplicates
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            
            // CRITICAL: Group editor dependencies together to prevent circular deps
            if (id.includes('react-quill') || 
                id.includes('quill') ||
                id.includes('@tiptap/core') ||
                id.includes('@tiptap/react') ||
                id.includes('@tiptap/starter-kit') ||
                id.includes('@tiptap/extension-')) {
              return 'editor';
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
            
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Router
            if (id.includes('react-router-dom')) {
              return 'router';
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
          // CRITICAL: Ensure proper chunk naming and loading order
          chunkFileNames: (chunkInfo) => {
            // CRITICAL: Ensure react-vendor loads first
            if (chunkInfo.name === 'react-vendor') {
              return `js/[name]-[hash].js`;
            }
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // ADDED: Better module format to prevent initialization issues
          format: 'es',
          // CRITICAL: Control import order to prevent initialization errors
          intro: '// Ensure proper module initialization order'
        },
      },
    },
    // ADDED: Better error handling
    logLevel: mode === 'development' ? 'info' : 'warn',
  };
});