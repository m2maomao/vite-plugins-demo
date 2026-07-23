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
        theme: { primaryColor: 'red', darkMode: true },
        layout: 'top',
        i18n: {
          locale: 'zh-CN',
          messages: {
            'zh-CN': { message: { hello: '你好' } },
            'en-US': { message: { hello: 'Hello' } },
          },
        },
      },
      runtimePlugins: [
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
  server: {
    host: true,
    open: true,
  },
});
