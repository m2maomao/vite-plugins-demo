import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from '@tailwindcss/vite';
import {
  configPlugin,
  setupPlugin,
  apiPlugin,
  builtinPlugin,
  authPlugin,
  scanPagesPlugin,
  piniaPlugin,
} from 'deer-mobile';

export default defineConfig({
  optimizeDeps: {
    include: ['deer-mobile'],
  },
  plugins: [
    tailwindcss(),
    vueJsx(),
    scanPagesPlugin({
      pluginRoutes: [
        {
          path: '/login',
          file: 'virtual:builtin/login',
        },
        {
          path: '/:pathMatch(.*)*',
          file: 'virtual:builtin/404',
        },
      ],
    }),
    configPlugin({ title: 'PROJECT_NAME' }, [piniaPlugin]),
    setupPlugin(),
    apiPlugin(),
    builtinPlugin(),
    authPlugin(),
  ],
  server: {
    host: true, // 监听所有网络接口，允许通过 127.0.0.1 和局域网 IP 访问
    open: true,
    proxy: { '/api': 'http://localhost:3001' },
  },
});
