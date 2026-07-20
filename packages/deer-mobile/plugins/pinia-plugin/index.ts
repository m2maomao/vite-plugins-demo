import type { FrameworkPlugin } from '../config-plugin';

/**
 * Pinia 框架插件
 * 自动将 createPinia + pinia-plugin-persistedstate 注入到虚拟模块 virtual:setup-app 的启动流程中
 */
const piniaPlugin: FrameworkPlugin = {
  name: 'pinia',
  onImport: () =>
    [`import { createPinia } from 'pinia'`, `import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'`].join(
      '\n',
    ),
  onRuntime: () => [`const pinia = createPinia()`, `pinia.use(piniaPluginPersistedstate)`, `app.use(pinia)`].join('\n'),
};

export default piniaPlugin;
