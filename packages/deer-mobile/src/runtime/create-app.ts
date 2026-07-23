/**
 * Deer Mobile — createRuntimeApp
 */

import { createApp, h } from 'vue';
import { createRouter, createWebHistory, createWebHashHistory, RouterView, type RouteRecordRaw } from 'vue-router';
import type { AppConfig } from '../build/types';
import { PluginManager } from './plugin-manager';

export interface CreateRuntimeAppOptions {
  pluginManager: PluginManager;
  routes: RouteRecordRaw[];
  appConfig: AppConfig;
  historyMode?: 'web' | 'hash';
}

export async function createRuntimeApp(options: CreateRuntimeAppOptions) {
  const { pluginManager, routes, appConfig, historyMode = 'web' } = options;
  const ctx = pluginManager.getContext();

  // 1. 创建 Router
  const history = historyMode === 'hash' ? createWebHashHistory(appConfig.base) : createWebHistory(appConfig.base);
  const router = createRouter({ history, routes });
  ctx.router = router;

  // 2. 使用 composeRootContainer 构建组件树（支持 rootContainer/innerProvider/outerProvider 钩子）
  const renderRoot = pluginManager.composeRootContainer(() => h(RouterView));
  const app = createApp({
    setup() {
      return renderRoot;
    },
  });
  ctx.app = app;

  // 3. onAppCreated 钩子
  await pluginManager.callHook('onAppCreated', app);

  // 4. 注册路由监听
  router.beforeEach((to, from, next) => {
    pluginManager.callHook('onPageLeave', from);
    next();
  });
  router.afterEach((to, from) => {
    pluginManager.callHook('onRouteChange', to, from);
    pluginManager.callHook('onPageEnter', to);
  });

  // 5. onRouterCreated 钩子
  await pluginManager.callHook('onRouterCreated', router);

  // 6. 必须先 app.use(router) 再 router.isReady()
  app.use(router);
  await router.isReady();

  // 7. onRouterReady 钩子
  await pluginManager.callHook('onRouterReady', router);

  // 8. 错误处理
  app.config.errorHandler = (err: unknown) => {
    console.error('[Deer] Error:', err);
    pluginManager.callHook('onError', err as Error);
  };

  // 9. 挂载
  await pluginManager.callHook('onBeforeMount', app);
  app.mount('#app');
  await pluginManager.callHook('onMounted');
}
