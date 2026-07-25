/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', 'playground'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.ts', 'src/components/**/*.vue'],
    },
    globals: true,
  },
});
