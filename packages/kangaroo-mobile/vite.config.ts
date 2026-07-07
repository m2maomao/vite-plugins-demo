import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'KangarooMobile',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'vant', '@iconify/vue']
    }
  }
})