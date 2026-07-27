import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/visual',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5174',
    viewport: { width: 375, height: 812 },
    actionTimeout: 10000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npx vite --config playground/vite.config.ts --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    cwd: '.',
  },
});
