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
      // Temporarily remove dedupe to simplify
      // dedupe: ['react', 'react-dom'],
    },
    // Temporarily simplify optimizeDeps
    // optimizeDeps: {
    //   include: [
    //     'react',
    //     'react-dom',
    //     'react/jsx-runtime',
    //     'react-router-dom',
    //     '@supabase/supabase-js',
    //     '@tanstack/react-query',
    //     'framer-motion',
    //     'lucide-react',
    //     'quill',
    //     '@tiptap/core',
    //     '@tiptap/react',
    //     '@tiptap/starter-kit'
    //   ],
    //   exclude: ['@zoroaster/shared'],
    //   force: true,
    //   esbuildOptions: {
    //     target: 'es2020',
    //     define: {
    //       global: 'globalThis'
    //     },
    //     keepNames: true,
    //     treeShaking: true
    //   },
    // },
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
      hmr: {
        overlay: true
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      target: 'es2020',
      chunkSizeWarningLimit: 1000,
      minify: mode === 'production' ? 'terser' : false,
      // Temporarily remove custom terserOptions
      // terserOptions: {
      //   compress: {
      //     keep_fnames: true,
      //     keep_classnames: true,
      //     drop_console: false,
      //     drop_debugger: true
      //   },
      //   mangle: {
      //     keep_fnames: true,
      //     keep_classnames: true
      //   }
      // },
      rollupOptions: {
        external: [],
        // Temporarily remove custom treeshake and manualChunks
        // treeshake: {
        //   moduleSideEffects: false,
        //   unknownGlobalSideEffects: false
        // },
        // output: {
        //   manualChunks: (id) => {
        //     if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
        //       return 'react-vendor';
        //     }
        //     if (id.includes('react-quill') || 
        //         id.includes('quill') ||
        //         id.includes('@tiptap/core') ||
        //         id.includes('@tiptap/react') ||
        //         id.includes('@tiptap/starter-kit') ||
        //         id.includes('@tiptap/extension-')) {
        //       return 'editor';
        //     }
        //     if (id.includes('@supabase/supabase-js')) {
        //       return 'supabase';
        //     }
        //     if (id.includes('@tanstack/react-query')) {
        //       return 'query';
        //     }
        //     if (id.includes('@nextui-org/react') || id.includes('framer-motion')) {
        //       return 'ui-heavy';
        //     }
        //     if (id.includes('lucide-react')) {
        //       return 'icons';
        //     }
        //     if (id.includes('react-router-dom')) {
        //       return 'router';
        //     }
        //     if (id.includes('clsx') || 
        //         id.includes('tailwind-merge') ||
        //         id.includes('class-variance-authority')) {
        //       return 'utils';
        //     }
        //     if (id.includes('node_modules')) {
        //       return 'vendor';
        //     }
        //   },
        //   chunkFileNames: (chunkInfo) => {
        //     if (chunkInfo.name === 'react-vendor') {
        //       return `js/[name]-[hash].js`;
        //     }
        //     return `js/[name]-[hash].js`;
        //   },
        //   entryFileNames: 'js/[name]-[hash].js',
        //   assetFileNames: 'assets/[name]-[hash].[ext]',
        //   format: 'es',
        //   intro: '// Ensure proper module initialization order'
        // },
      },
    },
    logLevel: mode === 'development' ? 'info' : 'warn',
  };
});