/**
 * Deer Mobile — Auth Runtime Plugin
 *
 * 路由守卫：从 Pinia store 读取 token 判断登录状态。
 * 使用 Pinia store 而非 localStorage，确保与 persistedstate 同步。
 *
 * 优先级: 1
 * 钩子: onRouterCreated（注册 beforeEach 守卫）
 */

import { useUserStore } from '../../src/stores';
import type { RuntimePlugin } from '../../src/runtime/types';

const authRuntimePlugin: RuntimePlugin = {
  name: 'deer:auth',
  priority: 1,

  onRouterCreated: (router, ctx) => {
    const noAuthPages: string[] = ctx.config.noNavPages ?? ['/login', '/404'];

    router.beforeEach((to) => {
      try {
        const userStore = useUserStore();
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

      // 降级方案：localStorage
      const token = localStorage.getItem('token');
      if (!token && !noAuthPages.includes(to.path)) {
        return '/login';
      }
    });
  },
};

export default authRuntimePlugin;
