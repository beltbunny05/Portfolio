import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:5100', headless: true },
  webServer: {
    command: 'node scripts/serve.mjs preview',
    url: 'http://127.0.0.1:5100',
    reuseExistingServer: false,
  },
  timeout: 30000,
});
