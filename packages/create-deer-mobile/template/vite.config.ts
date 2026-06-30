import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from '@tailwindcss/vite';
import scanPagesPlugin from './plugins/scan-pages-plugin';
import configPlugin from './plugins/config-plugin';
import setupPlugin from './plugins/setup-plugin';
import apiPlugin from './plugins/api-plugin';
import builtinPlugin from './plugins/builtin-plugin';
import authPlugin from './plugins/auth-plugin';

export default defineConfig({
  plugins: [
    tailwindcss(),
    vueJsx(),
    scanPagesPlugin(),
    configPlugin({ title: 'PROJECT_NAME' }),
    setupPlugin(),
    apiPlugin(),
    builtinPlugin(),
    authPlugin()
  ],
  server: { proxy: { '/api': 'http://localhost:3001' } },
})