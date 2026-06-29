import { defineConfig } from "vite";
import VueJsx from '@vitejs/plugin-vue-jsx';
import helloPlugin from "./plugins/hello-plugin";
import timestampPlugin from "./plugins/timestamp-plugin";
import greetingPlugin from "./plugins/greeting-plugin";
import loggerPlugin from './plugins/logger-plugin';
import scanPagesPlugin from './plugins/scan-pages-plugin';

export default defineConfig({
  plugins: [
    VueJsx(),
    scanPagesPlugin({
      pluginRoutes: [
        {
          path: '/test-route',
          file: '/src/pages/about.tsx'
        },
        {
          path: '/old-home',
          redirect: '/'
        }
      ]
    }),
    helloPlugin(),
    timestampPlugin(),
    greetingPlugin(),
    loggerPlugin({
      prefix: '📚',
      showFileList: true,
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})