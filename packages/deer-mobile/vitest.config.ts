/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: {
      'virtual:app-config': path.resolve(__dirname, 'test/mocks/virtual-app-config.ts'),
      'virtual:api': path.resolve(__dirname, 'test/mocks/virtual-api.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'plugins/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'plugins/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },
    globals: true,
  },
});
