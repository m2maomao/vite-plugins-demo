import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import {
  scanPagesPlugin,
  builtinPlugin,
  mockPlugin,
  apiPlugin,
  deer,
  piniaRuntimePlugin,
  authRuntimePlugin,
  i18nRuntimePlugin,
  apiRuntimePlugin,
  themeRuntimePlugin,
} from 'deer-mobile';

export default defineConfig({
  plugins: [
    tailwindcss(),
    Vue(),
    VueJsx(),

    scanPagesPlugin({
      pluginRoutes: [
        { path: '/test-route', file: '/src/pages/about.tsx' },
        { path: '/old-home', redirect: '/' },
        { path: '/login', file: 'virtual:builtin/login' },
        { path: '/pinia-demo', file: 'virtual:builtin/pinia-demo' },
        { path: '/:pathMatch(.*)*', file: 'virtual:builtin/404' },
      ],
    }),
    builtinPlugin(),
    apiPlugin(),
    mockPlugin({ enabled: true }),

    deer({
      config: {
        title: '111',
        author: 'michael',
        theme: { primaryColor: 'red', darkMode: false },
        layout: 'top',
        // vConsole 移动端调试面板：dev 自动启用；生产可 ?vconsole=1 按需打开；测试包可设 enabled: 'always'
        vconsole: {
          enabled: 'auto',
          // options: { theme: 'dark', maxLogNumber: 1000 },
        },
        i18n: {
          locale: 'zh-CN',
          messages: {
            'zh-CN': { message: { hello: '你好' } },
            'en-US': { message: { hello: 'Hello' } },
          },
        },
      },
      runtimePlugins: [
        themeRuntimePlugin,
        piniaRuntimePlugin,
        authRuntimePlugin,
        i18nRuntimePlugin,
        apiRuntimePlugin,
        {
          name: 'page-stats',
          priority: 20,
          onRouterCreated: (router) => {
            router.afterEach((to) => {
              console.log('📊 访问：', to.path);
            });
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  optimizeDeps: {
    include: ['deer-mobile'],
  },
  server: {
    host: true,
    open: true,
  },
});
