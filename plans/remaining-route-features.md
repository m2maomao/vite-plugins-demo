# 路由参数校验 + 多布局自动扫描 方案

## 功能1：路由参数校验

### 目标
页面通过 `routeMeta` 声明路由参数校验规则，导航时自动校验。

### 使用方式

```typescript
// src/pages/user/[id].tsx
export const routeMeta = {
  params: {
    id: { type: 'number', required: true, min: 1 },
  },
};
```

### 实现

1. `scanPagesPlugin` 已提取 `routeMeta`，`params` 字段自动进入 `route.meta.params`
2. 在 `createRuntimeApp` 的 `onRouterCreated` 阶段注册全局路由守卫：

```typescript
router.beforeEach((to) => {
  const rules = to.meta?.params as Record<string, any>;
  if (!rules) return;

  for (const [key, rule] of Object.entries(rules)) {
    const value = to.params[key];
    if (rule.required && !value) return '/404';
    if (rule.type === 'number' && value && isNaN(Number(value))) return '/404';
    if (rule.min !== undefined && Number(value) < rule.min) return '/404';
    if (rule.max !== undefined && Number(value) > rule.max) return '/404';
    if (rule.pattern && !new RegExp(rule.pattern).test(String(value))) return '/404';
  }
});
```

### 改动文件
- `src/runtime/create-app.ts` — 添加 params 校验守卫

## 功能2：多布局文件自动扫描

### 目标
自动扫描 `layouts/` 目录（与 `pages/` 同级），将文件自动注册到 LayoutResolver。

### 实现

在 LayoutResolver 中用动态 import 按需加载布局组件：

```typescript
// layouts/index.tsx
const layoutModules = import.meta.glob('../../layouts/*.tsx', { 
  exclude: ['../../layouts/index.tsx'],
  eager: false,
});
```

但 `import.meta.glob` 在 deer-mobile 的上下文中路径解析可能不准确。

**更可靠的方式**：在 `scanPagesPlugin` 中额外添加 `virtual:layout-registry` 虚拟模块，扫描 `src/layouts/` 目录生成布局注册代码。

### 更简单的实现

直接在 LayoutResolver 中用动态 import：

```typescript
const LAYOUT_REGISTRY: Record<string, () => Promise<Component>> = {
  default: () => Promise.resolve(DefaultLayout),
  blank: () => Promise.resolve(BlankLayout),
  tabs: () => Promise.resolve(TabBarLayout),
  // 通过 appConfig 或约定自动发现
};
```

但动态加载需要异步，与当前同步的 `computed` 不兼容。

**最终方案**：修改 `scanPagesPlugin` 同时扫描 `src/layouts/*.tsx`（排除 index.tsx），在生成的代码中添加布局注册信息到 `appConfig`，或生成一个附加的虚拟模块。

### 改动文件
- `plugins/scan-pages-plugin/index.ts` — 添加 layouts 扫描
- `src/layouts/index.tsx` — 从 appConfig 读取额外布局
