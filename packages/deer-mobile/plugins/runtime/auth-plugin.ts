/**
 * Deer Mobile — Auth Runtime Plugin
 *
 * 路由守卫：从 Pinia store 读取 token 判断登录状态。
 * 使用 Pinia store 而非 localStorage，确保与 persistedstate 同步。
 *
 * 优先级: 1
 * 钩子: onRouterCreated（注册 beforeEach 守卫）
 */

import type { RuntimePlugin } from '../../src/runtime/types';

const authRuntimePlugin: RuntimePlugin = {
  name: 'deer:auth',
  priority: 1,

  onRouterCreated: async (router, ctx) => {
    const noAuthPages: string[] = ctx.config.noNavPages ?? ['/login', '/404'];

    // 动态导入 store
    let useUserStoreFn: (() => { token: string }) | null = null;
    try {
      const stores = await import('deer-mobile/stores');
      useUserStoreFn = stores.useUserStore;
    } catch {
      // store 不可用
    }

    router.beforeEach((to) => {
      // 优先从 Pinia store 读取
      if (useUserStoreFn) {
        try {
          const userStore = useUserStoreFn();
          if (userStore.token && !noAuthPages.includes(to.path)) {
            return; // 已登录，放行
          }
          if (!userStore.token && !noAuthPages.includes(to.path)) {
            return '/login';
          }
          return; // 未登录但在免登录页面，放行
        } catch {
          // store 未就绪，降级到 localStorage
        }
      }

      // 降级方案：localStorage
      const token = localStorage.getItem('token');
      if (!token && !noAuthPages.includes(to.path)) {
        return '/login';
      }
    });
  },
};

export default authRuntimePlugin;
