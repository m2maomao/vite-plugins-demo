import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from '@tailwindcss/vite';
import {
  configPlugin,
  setupPlugin,
  apiPlugin,
  builtinPlugin,
  authPlugin,
  scanPagesPlugin
} from 'deer-mobile';

export default defineConfig({
  optimizeDeps: {
    include: ['deer-mobile']
  },
  plugins: [
    tailwindcss(),
    vueJsx(),
    scanPagesPlugin({
      pluginRoutes: [
        {
          path: '/login',
          file: 'virtual:builtin/login'
        },
        {
          path: '/:pathMatch(.*)*',
          file: 'virtual:builtin/404',
        }
      ]
    }),
    configPlugin({ title: 'PROJECT_NAME' }),
    setupPlugin(),
    apiPlugin(),
    builtinPlugin(),
    authPlugin()
  ],
  server: { proxy: { '/api': 'http://localhost:3001' } },
})