import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: 'portfolio.spec.js',
  use: { baseURL: 'http://127.0.0.1:6100', headless: true },
  webServer: {
    command: 'node scripts/serve.mjs preview',
    env: { PORTFOLIO_BASE_PORT: '6100' },
    url: 'http://127.0.0.1:6100',
    reuseExistingServer: false,
  },
  timeout: 30000,
});
