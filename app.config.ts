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
  },
});

// NOTE: Netlify serverless functions have a file descriptor limit. If you see EMFILE errors, ensure your bundle is small and avoid dynamic imports in serverless code.
// If needed, use a netlify.toml with [functions] included_files/excluded_files to control what gets deployed.
