import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    preset: 'netlify',
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
    // @ts-ignore - Adding allowedHosts for ngrok
    server: {
      allowedHosts: ["basically-enough-clam.ngrok-free.app"],
    },
    build: {
      rollupOptions: {
        // Externalize deps that shouldn't be bundled
        external: [/^node:.*/, 'fsevents'],
        output: {
          // Ensure ESM output
          format: 'es',
          // Place dynamic imports in a predictable directory
          chunkFileNames: 'chunks/[name]-[hash].js',
        },
      },
      // Ensure proper ESM handling
      target: 'esnext',
      modulePreload: {
        polyfill: false,
      },
    },
    optimizeDeps: {
      // Force include problematic ESM packages
      include: ['viem', '@tanstack/react-router', '@trpc/client'],
    },
  },
});

// NOTE: Netlify serverless functions have a file descriptor limit. If you see EMFILE errors, ensure your bundle is small and avoid dynamic imports in serverless code.
// If needed, use a netlify.toml with [functions] included_files/excluded_files to control what gets deployed.
