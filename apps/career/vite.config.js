import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  server: { cors: { origin: 'http://127.0.0.1:5100' } },
  preview: { cors: { origin: 'http://127.0.0.1:5100' } },
  build: {
    minify: 'esbuild',
    lib: { entry: 'src/entry.js', formats: ['es'], fileName: () => 'entry.js' },
  },
});
