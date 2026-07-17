# Token 持久化方案对比

## 四种主流方案

### 方案 A：Pinia Store + 原生 localStorage（当前做法）

```typescript
// stores/userStore.ts
const token = ref(localStorage.getItem('token') ?? '');
function setToken(t: string) {
  token.value = t;
  localStorage.setItem('token', t);
}
```

| 维度 | 评价 |
|------|------|
| 依赖 | 无额外依赖 |
| 可测试性 | ⭐⭐⭐ 一般，需 mock localStorage |
| 简洁度 | ⭐⭐ 每个方法都要手动读写 |
| 响应式同步 | ⭐ 手动单向同步，易遗漏 |
| **代表项目** | 中小型项目、早期项目 |

### 方案 B：`useStorage` 自动同步

```typescript
import { useStorage } from '@vueuse/core';
const token = useStorage('token', '');
// 直接 .value 读写，自动同步 localStorage
```

| 维度 | 评价 |
|------|------|
| 依赖 | `@vueuse/core`（可能已经装了） |
| 可测试性 | ⭐⭐⭐ 一般 |
| 简洁度 | ⭐⭐⭐⭐⭐ 一行搞定 |
| 响应式同步 | ⭐⭐⭐⭐⭐ 双向绑定 |
| **代表项目** | VueUse 生态项目、小团队 |

### 方案 C：`pinia-plugin-persistedstate`（大厂常见）

```typescript
// 插件注册后，store 加一个配置即可
export const useUserStore = defineStore('user', {
  state: () => ({ token: '' }),
  persist: true,  // 自动持久化所有 state
})
```

| 维度 | 评价 |
|------|------|
| 依赖 | `pinia-plugin-persistedstate` |
| 可测试性 | ⭐⭐⭐⭐ 较好的测试支持 |
| 简洁度 | ⭐⭐⭐⭐⭐ 声明式配置 |
| 响应式同步 | ⭐⭐⭐⭐⭐ 全自动 |
| **代表项目** | 中大型 Vue3 项目、团队协作项目 |

### 方案 D：不存 Store，直接读 localStorage（极简/SSR 友好）

```typescript
// 不在 store 里存 token，需要时直接从 localStorage 读
function getToken() { return localStorage.getItem('token'); }
```

| 维度 | 评价 |
|------|------|
| 依赖 | 无 |
| 可测试性 | ⭐⭐⭐⭐⭐ 最易测试 |
| 简洁度 | ⭐⭐⭐⭐⭐ 最轻量 |
| 响应式同步 | ⭐ 无响应式，需手动触发更新 |
| **代表项目** | 工具库、SSR 项目、token 只在请求拦截器中使用 |

## 大厂的主流选择

| 公司/项目 | 方案 | 原因 |
|-----------|------|------|
| **Vue 核心团队（Nuxt）** | 方案 C `pinia-plugin-persistedstate` | 官方推荐的 Pinia 生态插件 |
| **Element Plus** | 方案 D 直接读 localStorage | 组件库不做状态管理 |
| **Vant** | 方案 D 直接读 localStorage | 同上，组件库不关心业务状态 |
| **中型后台项目** | 方案 C 居多 | 声明式、可维护性好 |
| **小型项目/个人** | 方案 A 或 B | 简单直接 |

## 你当前的场景分析

你的 `deer-mobile` 是一个**框架（非组件库）**，它提供了 Pinia store 给使用者：

1. **`userStore.ts`** 是框架提供的 store，会被使用方的业务代码引用
2. **`auth-plugin.ts`** 路由守卫通过 `localStorage.getItem('token')` 读 token

这里有个关键问题：**谁拥有 token 的读写权？**

```
login 页面           userStore        localStorage       auth-plugin
  │                    │                  │                  │
  │ setToken(token) ──→│── setItem() ────→│                  │
  │                    │                  │                  │
  │                    │                  │── getItem() ────→│ 路由守卫
```

## 推荐方案

### 短期（现在能做）

**保持方案 A（当前做法）不变**，因为你已经在用了，功能正常，且不引入新依赖。当前做法的核心逻辑没问题。

### 中期（如果项目变大）

**迁移到方案 C** `pinia-plugin-persistedstate`，原因：

1. 声明式配置，减少样板代码
2. 团队成员一眼就能看出「这个 store 持久化了」
3. 与 `deer-mobile` 框架的定位匹配（框架应提供开箱即用的体验）
4. 支持序列化自定义（比如 token 加密存储）

### 不建议方案 B（useStorage）的原因

- `useStorage` 是 UI 层的工具函数，放在 store 内部使用会耦合 VueUse
- 如果后期要支持 SSR 或有 Node.js 环境需求，`useStorage` 需要额外配置
- `userStore` 封装在 Pinia 里的初心就是**统一 token 管理入口**，用原生 localStorage 反而更纯粹

## 总结

| 你的担心 | 答案 |
|----------|------|
| 「Pinia 不是会丢状态吗？」 | 是的，但 `userStore` 手动在初始化时从 localStorage 读取，所以刷新后恢复了 |
| 「那不就变成持久化了吗？」 | 对，本质上就是持久化了，用原生 API 手动实现的 |
| 「用 useStorage 是不是更好？」 | 不一定。当前实现功能等价，且不增加依赖。**功能等价，不引入外部依赖是合理的选择** |
| 「大厂怎么做？」 | 多数用 `pinia-plugin-persistedstate` 或直接原生 localStorage |

**结论：当前方案没有问题，可以保持现状。如果未来想更优雅，推荐迁移到 `pinia-plugin-persistedstate`。**
