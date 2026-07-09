import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import path from 'path'

export default defineConfig({
  // ✅ 关键：告诉 Vite，当前目录就是根
  root: __dirname,

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      customCollections: {
        deer: FileSystemIconLoader(
          path.resolve(__dirname, '../src/assets/icons'),
          svg => svg
        ),
      },
    }),
  ],
})