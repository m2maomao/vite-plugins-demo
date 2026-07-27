# 环境变量封装方案 v2

> **最后更新**: 2026-07-27 | 状态: 规划中

---

## 一、大厂怎么做？行业最佳实践参考

### Nuxt 3 — runtimeConfig（推荐参考）

Nuxt 3 把环境变量作为**框架的一等公民**，内建在核心配置中：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私密变量（仅服务端）
    apiSecret: '',
    // 公开变量（客户端也可见）
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
})

// 运行时访问
const config = useRuntimeConfig();
console.log(config.public.apiBase);
```

**关键设计决策**: 环境变量是框架核心配置的一部分（`runtimeConfig`），不是通过插件系统加载的。

### Next.js — NEXT_PUBLIC_ 约定

```
NEXT_PUBLIC_ANALYTICS_ID=UA-000000
```

Next.js 通过**命名约定**（`NEXT_PUBLIC_` 前缀）来标记哪些变量应该暴露给客户端，构建时自动替换 `process.env.NEXT_PUBLIC_*`。

### Umi 4 — define 注入

```ts
export default defineConfig({
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
  },
})
```

Umi 4 将环境变量注入作为 `define` 配置项，构建时替换源码中的表达式。

### 核心结论

| 框架 | 机制 | 是否内建 | 访问方式 |
|------|------|---------|---------|
| Nuxt 3 | `runtimeConfig` | ✅ 是 | `useRuntimeConfig()` |
| Next.js | `NEXT_PUBLIC_` 约定 | ✅ 是 | `process.env.NEXT_PUBLIC_*` |
| Umi 4 | `define` 配置项 | ✅ 是 | `process.env.*` |
| Vite 原生 | `import.meta.env` | ⚠️ 半内建 | `import.meta.env.VITE_*` |

**结论**: 所有主流框架都将环境变量处理作为**框架内建功能**，而非可选插件。deer-mobile 也应如此。

---

## 二、Deer Mobile 设计方案

### 2.1 设计原则

1. **内建而非插件**：`env` 是 `deer()` 顶级选项的一部分，不需要用户额外注册插件
2. **类型安全**：用户声明即获得 TypeScript 类型推导
3. **单一数据源**：环境变量最终汇入 `AppConfig`，运行时统一通过 `appConfig` 访问
4. **渐进式**：简单场景自动工作，复杂场景提供细粒度控制

### 2.2 核心数据流

```
┌─────────────────────────────────────────────────────────┐
│                   用户 vite.config.ts                      │
│                                                          │
│  deer({                                                  │
│    config: { title: 'My App', ... },                     │
│    env: {                                                │
│      // 声明式：Key = 运行时字段名, Value = 环境变量名      │
│      apiBaseUrl: 'VITE_API_BASE_URL',                     │
│      appVersion: 'VITE_APP_VERSION',                      │
│    }                                                      │
│  })                                                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Build Time（setup-plugin）                  │
│                                                          │
│  Vite loadEnv(mode, root, '') ──────┐                    │
│                                     ▼                    │
│  appConfig.env = {                                        │
│    apiBaseUrl: 'https://api.example.com',   ← VITE_API   │
│    appVersion: '1.0.0',                   ← VITE_APP     │
│  }                                                        │
│                                                          │
│  + 自动生成 src/env.d.ts 类型声明                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Runtime（virtual:app-config）                  │
│                                                          │
│  import { appConfig } from 'virtual:app-config';         │
│  appConfig.env.apiBaseUrl  →  ✅ 类型安全                  │
│  ctx.config.env.apiBaseUrl →  ✅ RuntimePlugin 上下文     │
└─────────────────────────────────────────────────────────┘
```

### 2.3 类型定义

```typescript
// ============================================
// packages/deer-mobile/src/build/types.ts
// ============================================

// ---- 新增：环境变量声明 ----

/** 环境变量定义：Key = 运行时字段名, Value = 环境变量名 */
export type EnvDefinitions = Record<string, string>;

/** 环境变量运行时值 */
export type EnvValues<T extends EnvDefinitions = {}> = {
  [K in keyof T]: string;
};

// ---- AppConfig 追加 env 字段 ----

export interface AppConfig {
  // ... 现有字段不变
  title: string;
  description: string;
  author: string;
  base: string;
  theme: { primaryColor: string; darkMode: boolean };
  layout: 'side' | 'top' | 'mix';
  noNavPages: string[];
  request: { baseURL: string };
  sm4Key?: string;
  i18n?: { locale: string; fallbackLocale?: string; messages?: ... };
  mock?: { enabled?: boolean; dir?: string };
  [key: string]: unknown;

  // ---- 新增：运行时环境变量 ----
  env: EnvValues;
}
```

```typescript
// ============================================
// packages/deer-mobile/plugins/setup-plugin/types.ts
// ============================================

export interface DeerOptions {
  /** 应用配置 */
  config?: Partial<AppConfig>;

  /** 环境变量声明（内建，非插件）
   *
   *  @example
   *  env: {
   *    apiBaseUrl: 'VITE_API_BASE_URL',
   *    appVersion: 'VITE_APP_VERSION',
   *  }
   */
  env?: EnvDefinitions;

  /** 运行时代码中注入 import.meta.env 原始值（默认 true）
   *  设为 false 可禁止暴露任何 VITE_* 变量到运行时 */
  envFallback?: boolean;

  // ... 现有选项
  buildPlugins?: BuildPlugin[];
  runtimePlugins?: RuntimePlugin[];
  presets?: Preset[];
  modifyRoutes?: ...;
  modifyConfig?: ...;
  onGenerate?: ...;
}
```

### 2.4 实现逻辑（setup-plugin 内建）

环境变量处理**不**需要单独的 BuildPlugin，而是在 [`setup-plugin/index.ts`](../packages/deer-mobile/plugins/setup-plugin/index.ts) 内部完成：

```typescript
// setup-plugin/index.ts — 新增逻辑
import { loadEnv } from 'vite';

export default function deer(options: DeerOptions = {}): Plugin {
  // ---- 处理环境变量 ----
  const env = processEnv(options.env, options.envFallback);

  // ---- 合并配置 ----
  let appConfig: AppConfig = {
    ...DEFAULT_CONFIG,
    ...options.config,
    env,                                          // ← 注入环境变量
    theme: { ...DEFAULT_CONFIG.theme, ...options.config?.theme },
    request: { ...DEFAULT_CONFIG.request, ...options.config?.request },
  };

  // ... 后续逻辑不变

  return {
    name: 'deer:setup',
    config(viteConfig) {
      // modifyConfig 阶段仍然可以访问和修改 env
      for (const fn of state.modifyConfigFns) {
        const result = fn(appConfig);
        if (result) appConfig = result;
      }
      return { base: appConfig.base };
    },
    // ... 其余不变
  };
}

/** 读取 .env 文件并构建运行时环境变量对象 */
function processEnv(
  definitions?: Record<string, string>,
  fallback = true,
): Record<string, string> {
  const mode = process.env.NODE_ENV || 'development';
  // loadEnv 会自动读取 .env.[mode] 和 .env 文件
  const viteEnv = loadEnv(mode, process.cwd(), '');

  const result: Record<string, string> = {};

  // 1. 自动暴露所有 VITE_ 前缀变量（转驼峰）
  if (fallback) {
    for (const [key, value] of Object.entries(viteEnv)) {
      if (key.startsWith('VITE_')) {
        const camelKey = key
          .replace(/^VITE_/, '')
          .toLowerCase()
          .replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        result[camelKey] = value ?? '';
      }
    }
  }

  // 2. 用户自定义映射（覆盖自动暴露的同名键）
  if (definitions) {
    for (const [runtimeKey, envVarName] of Object.entries(definitions)) {
      result[runtimeKey] = viteEnv[envVarName] ?? '';
    }
  }

  return result;
}
```

### 2.5 类型声明生成

在 `onGenerate` 阶段自动生成类型声明：

```typescript
// setup-plugin/index.ts — 在现有的 onGenerate 中添加
api.onGenerate((gen) => {
  if (options.env && Object.keys(options.env).length > 0) {
    gen.addEntryCode(`
// 运行时环境变量类型声明
declare module 'deer-mobile' {
  interface AppConfig {
    env: {
      ${Object.entries(options.env)
        .map(([key, envVar]) => `${key}: string;  // from ${envVar}`)
        .join('\n      ')}
    };
  }
}
`);
  }
});
```

或者，更好的做法是生成到物理文件 `src/env.d.ts`（在 `onBuildComplete` 中），但更推荐用虚拟模块 + 类型声明的方式。

### 2.6 用户端使用方式

#### vite.config.ts（最终用法）

```typescript
import { defineConfig } from 'vite';
import { deer } from 'deer-mobile';

export default defineConfig({
  plugins: [
    deer({
      config: {
        title: 'My App',
        request: {
          baseURL: '/api',      // 默认值
        },
      },
      // 声明式环境变量映射 — 内建功能，无需额外插件
      env: {
        apiBaseUrl: 'VITE_API_BASE_URL',
        appVersion: 'VITE_APP_VERSION',
        sm4Key: 'SM4_KEY',              // 非 VITE_ 前缀也能暴露
      },
    }),
  ],
});
```

#### .env 文件

```bash
# .env（通用）
VITE_APP_VERSION=1.0.0
SM4_KEY=your-sm4-key-here
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
```

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

#### 运行时访问

```typescript
// 方式一：通过 appConfig（推荐）
import { appConfig } from 'virtual:app-config';

console.log(appConfig.env.apiBaseUrl);  // 'http://localhost:3000/api'
console.log(appConfig.env.appVersion);  // '1.0.0'
console.log(appConfig.env.sm4Key);      // 'your-sm4-key-here'

// 方式二：通过 RuntimePlugin 上下文
const myPlugin: RuntimePlugin = {
  name: 'my-plugin',
  onAppCreated: (app, ctx) => {
    const baseURL = ctx.config.env.apiBaseUrl;
  },
};

// 方式三：appConfig 直接用于 request.baseURL 替换
// 如果用户想用 env 覆盖 appConfig 的字段，可以在 modifyConfig 中做
```

---

## 三、与现有系统的集成

### 3.1 AppConfig 关系图

```
AppConfig
├── title: string           ← 静态配置
├── request.baseURL: string ← 静态配置
├── env: {                  ← 新增：动态环境变量
│   apiBaseUrl: string      ← 来自 VITE_API_BASE_URL
│   appVersion: string      ← 来自 VITE_APP_VERSION
│   sm4Key: string          ← 来自 SM4_KEY
│ }
└── [key: string]: unknown  ← 插件扩展
```

### 3.2 为什么是 `appConfig.env` 而非直接合并？

虽然不需要向后兼容，但保持 `env` 独立命名空间仍是最佳实践：

1. **来源清晰**：一眼看出哪些值来自环境变量，哪些是静态配置
2. **安全可控**：只有 `env` 中声明的变量才会暴露到客户端
3. **类型推导**：`appConfig.env` 的类型由 `env` 声明自动推导
4. **与 Nuxt 3 对齐**：Nuxt 的 `runtimeConfig.public` 也是独立命名空间

### 3.3 如果用户想用 env 覆盖 AppConfig 字段

通过 `modifyConfig` BuildPlugin 可以实现：

```typescript
deer({
  config: { request: { baseURL: '/api' } },
  env: { apiBaseUrl: 'VITE_API_BASE_URL' },
  buildPlugins: [
    (api) => {
      api.modifyConfig((config) => ({
        ...config,
        request: {
          ...config.request,
          baseURL: config.env.apiBaseUrl || config.request.baseURL,
        },
      }));
    },
  ],
});
```

---

## 四、实施步骤

### Step 1: 扩展类型定义

- **文件**: [`packages/deer-mobile/src/build/types.ts`](../packages/deer-mobile/src/build/types.ts)
- **改动**:
  - 新增 `EnvDefinitions = Record<string, string>` 类型
  - `AppConfig` 追加 `env: Record<string, string>` 字段

### Step 2: 扩展 DeerOptions 类型

- **文件**: [`packages/deer-mobile/plugins/setup-plugin/types.ts`](../packages/deer-mobile/plugins/setup-plugin/types.ts)
- **改动**: `DeerOptions` 追加 `env?: EnvDefinitions` 和 `envFallback?: boolean`

### Step 3: 实现 env 处理逻辑

- **文件**: [`packages/deer-mobile/plugins/setup-plugin/index.ts`](../packages/deer-mobile/plugins/setup-plugin/index.ts)
- **改动**:
  - 引入 `loadEnv` from `vite`
  - 在 `deer()` 函数开头添加 `processEnv()` 调用
  - 将 `env` 合并到 `appConfig`

### Step 4: 生成类型声明

- **文件**: [`packages/deer-mobile/plugins/setup-plugin/index.ts`](../packages/deer-mobile/plugins/setup-plugin/index.ts) 或 [`code-gen.ts`](../packages/deer-mobile/plugins/setup-plugin/code-gen.ts)
- **改动**: 在 `onGenerate` 阶段根据 `options.env` 生成类型声明

### Step 5: 更新 `create-deer-mobile` 模板

- 添加 `.env`、`.env.development`、`.env.production`、`.env.local`（加入 `.gitignore`）
- 更新 `vite.config.ts` 演示 `env` 用法

### Step 6: 单元测试

- 测试 `processEnv()` 函数的映射逻辑
- 测试 `autoExpose=true` 时 VITE_ 前缀自动暴露
- 测试用户自定义映射覆盖
- 测试 `envFallback=false` 时禁用自动暴露

### Step 7: 更新文档

- 更新 [`plans/framework-comparison.md`](../plans/framework-comparison.md)

---

## 五、注意事项

### 5.1 `VITE_` 前缀与安全性

- `VITE_` 前缀的变量会被 Vite 打包到客户端代码
- 非 `VITE_` 前缀变量（如 `SM4_KEY`）**仅在构建时的 Node.js 环境可用**，通过 `loadEnv('', '')` 读取后注入到 `appConfig.env`
- 用户需要自行判断哪些变量应该暴露到客户端

### 5.2 `loadEnv` 的行为

- Vite 的 `loadEnv(mode, root, prefixes)` 自动加载 `.env.[mode]`、`.env`、`.env.local`
- 传递空字符串 `''` 作为 `prefixes` 会加载所有变量，包括非 `VITE_` 前缀
- 优先级：`.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`

### 5.3 与 `.gitignore` 的配合

```
# .gitignore 应包含
.env.local
.env.*.local
```

`.env`、`.env.development`、`.env.production` 应提交到 Git。
