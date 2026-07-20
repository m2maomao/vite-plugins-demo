import { defineConfig } from 'vite';
import VueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import {
  scanPagesPlugin,
  configPlugin,
  setupPlugin,
  apiPlugin,
  builtinPlugin,
  authPlugin,
  piniaPlugin,
} from 'deer-mobile';
import helloPlugin from './plugins/hello-plugin';
import timestampPlugin from './plugins/timestamp-plugin';
import greetingPlugin from './plugins/greeting-plugin';
import loggerPlugin from './plugins/logger-plugin';

// 定义一个框架插件
const pageStatsPlugin = {
  name: 'page-stats',
  onRuntime: () => `
    router.afterEach((to) => {
      // console.log('📊 访问：', to.path)
    })
  `,
};

const apiPluginRuntime = {
  name: 'api-runtime',
  onImport: () => `import { api } from 'virtual:api'`,
  onRuntime: () => `app.config.globalProperties.$api = api`,
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    VueJsx(),
    scanPagesPlugin({
      pluginRoutes: [
        {
          path: '/test-route',
          file: '/src/pages/about.tsx',
        },
        {
          path: '/old-home',
          redirect: '/',
        },
        {
          path: '/login',
          file: 'virtual:builtin/login',
        },
        {
          path: '/pinia-demo',
          file: 'virtual:builtin/pinia-demo',
        },
        {
          path: '/:pathMatch(.*)*',
          file: 'virtual:builtin/404',
        },
      ],
    }),
    helloPlugin(),
    timestampPlugin(),
    greetingPlugin(),
    loggerPlugin({
      prefix: '📚',
      showFileList: true,
    }),
    configPlugin(
      {
        title: '111',
        author: 'michael',
        theme: {
          primaryColor: 'red',
          darkMode: true,
        },
        layout: 'top',
      },
      [pageStatsPlugin, apiPluginRuntime, piniaPlugin],
    ),
    setupPlugin(),
    apiPlugin(),
    builtinPlugin(),
    authPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
