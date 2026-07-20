import type { Plugin } from 'vite';

export default function authPlugin(): Plugin {
  return {
    name: 'auth-plugin',

    transform(code, id) {
      // 向生成的启动代码注入路由守卫
      if (id.includes('virtual:setup-app')) {
        return {
          code: code
            .replace(
              `import { createApp, h, ref } from 'vue';`,
              `import { createApp, h, ref } from 'vue';\nimport { useUserStore } from 'deer-mobile/stores';`,
            )
            .replace(
              'app.use(router);',
              `
              // 路由守卫：未登录跳转登录页
              router.beforeEach((to) => {
                const userStore = useUserStore()
                const noAuthPages = ['/login', '/404']
                if (!userStore.token && !noAuthPages.includes(to.path)) {
                  return '/login'
                }
              })
              app.use(router);
            `,
            ),
          map: null,
        };
      }
    },
  };
}
