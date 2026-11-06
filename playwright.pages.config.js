import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: 'pages.spec.js',
  use: { baseURL: 'http://127.0.0.1:6200/Portfolio/', headless: true },
  webServer: {
    command:
      'node node_modules/vite/bin/vite.js preview --outDir dist/pages --base /Portfolio/ --host 127.0.0.1 --port 6200 --strictPort',
    url: 'http://127.0.0.1:6200/Portfolio/',
    reuseExistingServer: false,
  },
});
