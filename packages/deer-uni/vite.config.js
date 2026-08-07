import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 抑制 wot-design-uni 内部旧 Sass 语法（@import 等）的 deprecation 警告刷屏
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'if-function',
          'color-functions',
        ],
      },
    },
  },
})
