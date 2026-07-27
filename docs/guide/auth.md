# 鉴权

## 路由守卫

框架内置路由守卫，自动检查页面是否需要登录：

```typescript
// 需要登录的页面
export const routeMeta = { auth: true };

// 公开页面
export const routeMeta = { auth: false };
```

## Token 管理

使用 Pinia store 管理 Token：

```typescript
import { useUserStore } from 'deer-mobile/stores';

const userStore = useUserStore();
userStore.setToken('xxx');
userStore.logout();
```

Token 会自动通过 pinia-plugin-persistedstate 持久化到 localStorage。

## 自定义鉴权

可通过 RuntimePlugin 自定义鉴权逻辑：

```typescript
const authPlugin: RuntimePlugin = {
  name: 'custom-auth',
  onRouterCreated(router) {
    router.beforeEach((to, from, next) => {
      if (to.meta.auth && !isLoggedIn()) {
        next('/login');
      } else {
        next();
      }
    });
  },
};
```
