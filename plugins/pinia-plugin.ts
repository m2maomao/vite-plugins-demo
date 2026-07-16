import type { FrameworkPlugin } from './config-plugin';

/**
 * Pinia 框架插件
 * 自动将 createPinia 注入到虚拟模块 virtual:setup-app 的启动流程中
 */
const piniaPlugin: FrameworkPlugin = {
  name: 'pinia',
  onImport: () => `import { createPinia } from 'pinia'`,
  onRuntime: () => `app.use(createPinia())`,
};

export default piniaPlugin;
