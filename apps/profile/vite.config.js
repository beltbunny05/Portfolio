import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  server: { cors: { origin: ['http://127.0.0.1:5100', 'http://127.0.0.1:6100'] } },
  preview: { cors: { origin: ['http://127.0.0.1:5100', 'http://127.0.0.1:6100'] } },
  build: {
    minify: 'terser',
    lib: { entry: 'src/entry.ts', formats: ['es'], fileName: () => 'entry.js' },
  },
});
