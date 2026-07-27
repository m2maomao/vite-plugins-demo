# 状态管理

## Pinia

集成 Pinia 3.x，开箱即用：

```typescript
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    profile: null,
  }),
  actions: {
    async login(username: string, password: string) {
      // ...
    },
    logout() {
      this.token = '';
    },
  },
});
```

## 持久化

使用 `pinia-plugin-persistedstate` 自动持久化：

```typescript
export const useUserStore = defineStore('user', {
  // ...
}, {
  persist: true,  // 自动持久化到 localStorage
});
```

## 开箱即用的 Store

| Store | 说明 |
|-------|------|
| `useUserStore` | 用户认证状态（token、登录状态） |
