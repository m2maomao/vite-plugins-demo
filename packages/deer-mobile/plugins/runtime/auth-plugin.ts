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
      // 1. 页面级 auth 控制：auth: false 表示无需登录
      if (to.meta?.auth === false) return;

      // 2. 检查页面是否在免登录列表中
      if (noAuthPages.includes(to.path)) return;

      try {
        const userStore = useUserStore();
        if (userStore.token) {
          return; // 已登录，放行
        }
        // 未登录且需要 auth → 跳转登录页
        return '/login';
      } catch {
        // store 未就绪，降级到 localStorage
      }

      // 3. 降级方案：localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return '/login';
      }
    });
  },
};

export default authRuntimePlugin;
