import { defineConfig } from 'vite';
import { assetLabServer } from './tools/asset-pipeline/lab-server.ts';

export default defineConfig({
  plugins: [assetLabServer()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  build: { target: 'es2022' },
});
