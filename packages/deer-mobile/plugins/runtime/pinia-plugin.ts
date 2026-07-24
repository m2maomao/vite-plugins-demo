/**
 * Deer Mobile — Pinia Runtime Plugin
 *
 * 自动注入 Pinia 状态管理 + pinia-plugin-persistedstate 持久化。
 *
 * 优先级: 0（状态管理应最先初始化）
 * 钩子: onAppCreated
 */

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import type { RuntimePlugin } from '../../src/runtime/types';

const piniaRuntimePlugin: RuntimePlugin = {
  name: 'deer:pinia',
  priority: 0,

  onAppCreated: (app) => {
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
  },
};

export default piniaRuntimePlugin;
