# PWA 离线访问方案

> **最后更新**: 2026-07-27 | 状态: 规划中

---

## 一、背景

PWA（Progressive Web App）支持包含三个核心能力：

1. **Service Worker** — 拦截网络请求，实现离线缓存和预缓存
2. **Web App Manifest** — `manifest.json`，允许用户"添加到主屏幕"
3. **离线体验** — 网络不可用时展示离线页面而非浏览器错误页

当前 deer-mobile 框架**没有任何 PWA 相关代码**，该功能为 [「缺失功能 ❌」](../plans/framework-comparison.md) 中的 P3 项。

---

## 二、技术选型

### 社区方案对比

| 方案 | 维护状态 | 复杂度 | 说明 |
|------|---------|--------|------|
| `vite-plugin-pwa` | ✅ 活跃（18k⭐） | 低 | 基于 Workbox，零配置 SW 生成，自动 manifest |
| 手写 Workbox | ✅ 稳定 | 高 | 需自行管理 SW 注入和构建流程 |
| 手写 Service Worker | ⚠️ 可行 | 极高 | 无构建时注入能力，不适合框架 |
| `@vite-pwa/nuxt` | ✅ 活跃 | 低 | 专为 Nuxt 设计，不适合 |

**结论**: 推荐基于 [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) 封装，它：

- 是 Vite PWA 的事实标准（18k⭐）
- 自动生成 Service Worker（基于 Workbox）
- 自动生成 `manifest.json`
- 支持 TypeScript 配置
- 无外部 UI 依赖

### 与 deer-mobile 框架的关系

```
┌─────────────────────────────────────────────────────────┐
│                用户项目                                    │
│  deer({                                                  │
│    config: { ... },                                      │
│    buildPlugins: [                                       │
│      pwa({...}),      ← 新的 BuildPlugin                  │
│    ],                                                    │
│  })                                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│            pwaPlugin 内部实现                               │
│                                                          │
│  1. 在 modifyConfig 阶段将 PWA 配置注入 AppConfig          │
│  2. 在 onGenerate 阶段注册 vite-plugin-pwa                  │
│  3. 生成 sw.js + manifest.json                             │
│  4. 运行时通过 RuntimePlugin 管理更新逻辑                   │
└─────────────────────────────────────────────────────────┘
```

---

## 三、实现方案

### 3.1 架构

```
┌─────────────────────────────────────────┐
│          用户 deer() 配置                   │
│  pwa({                                   │
│    enabled: true,                        │
│    registerSW: true,   // 自动注册 SW    │
│    workbox: {                            │
│      globPatterns: ['**/*.{js,css,html}'],│
│      runtimeCaching: [                   │
│        { urlPattern: /^https?://api/,    │
│          handler: 'NetworkFirst' },      │
│      ],                                  │
│    },                                    │
│    manifest: {                           │
│      name: 'My App',                     │
│      short_name: 'App',                  │
│      display: 'standalone',              │
│      theme_color: '#1890ff',             │
│    },                                    │
│  })                                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│        pwaPlugin (BuildPlugin)           │
│                                          │
│  1. modifyConfig → 注入 appConfig.pwa    │
│  2. 内部使用 vite-plugin-pwa 注册到 Vite  │
│  3. registerSW: true → 自动注册 SW 代码  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│        vite-plugin-pwa                    │
│                                          │
│  - 生成 service-worker.js                │
│  - 生成 manifest.json                    │
│  - 注入 SW 注册脚本到 index.html          │
│  - 开发模式：SW 热更新                   │
└─────────────────────────────────────────┘
```

### 3.2 类型定义

在 [`packages/deer-mobile/src/build/types.ts`](../packages/deer-mobile/src/build/types.ts) 追加：

```typescript
/** PWA 配置选项 */
export interface PWAOptions {
  /** 是否启用 PWA（默认 false） */
  enabled?: boolean;

  /** 是否自动注册 Service Worker（默认 true） */
  registerSW?: boolean;

  /** Web App Manifest 配置 */
  manifest?: {
    name?: string;
    short_name?: string;
    description?: string;
    start_url?: string;
    display?: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
    orientation?: 'portrait' | 'landscape';
    theme_color?: string;
    background_color?: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type: string;
    }>;
  };

  /** Workbox 配置（SwPrecache 或 InjectManifest） */
  workbox?: {
    /** 预缓存的文件匹配模式 */
    globPatterns?: string[];
    /** 运行时缓存策略 */
    runtimeCaching?: Array<{
      urlPattern: string | RegExp;
      handler: 'NetworkFirst' | 'CacheFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      options?: Record<string, unknown>;
    }>;
  };

  /** 自定义 Service Worker 路径（若提供则跳过 Workbox 自动生成） */
  customSWPath?: string;

  /** 离线回退页面路径（默认 'virtual:builtin/offline'） */
  offlinePage?: string;
}
```

### 3.3 BuildPlugin 实现

新建 [`packages/deer-mobile/plugins/pwa-plugin/index.ts`](../packages/deer-mobile/plugins/pwa-plugin/index.ts)：

```typescript
import type { BuildPlugin, PWAOptions } from '../../src/build/types';

/**
 * PWA 插件
 *
 * 封装 vite-plugin-pwa，为 deer-mobile 应用提供 PWA 支持。
 *
 * @example
 * ```ts
 * deer({
 *   buildPlugins: [
 *     pwa({
 *       enabled: true,
 *       manifest: {
 *         name: 'My App',
 *         theme_color: '#1890ff',
 *       },
 *       workbox: {
 *         runtimeCaching: [
 *           { urlPattern: /\/api\//, handler: 'NetworkFirst' },
 *         ],
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export default function pwaPlugin(options?: PWAOptions): BuildPlugin {
  return (api) => {
    const config = options || { enabled: false };
    if (!config.enabled) return;

    // 1. 注入 PWA 配置到 AppConfig（运行时可用）
    api.modifyConfig((appConfig) => ({
      ...appConfig,
      pwa: {
        ...config,
        enabled: true,
      },
    }));

    // 2. 注册 vite-plugin-pwa 到 Vite（通过 addHTMLScript 注入 SW 注册代码）
    api.onInit(() => {
      const VitePluginPWA = require('vite-plugin-pwa').default;
      api.registerPlugin(() => {
        // 这个方法用来修改 Vite 配置
        // 但现有的 BuildAPI 没有直接修改 plugins 的能力
        // 需要通过在 modifyConfig 中返回 vite 配置来间接添加
      });
    });

    // 3. 注入 SW 注册代码到 HTML head
    const registerSWCode = generateRegisterSWCode(config);
    api.addHTMLHeadScript({
      content: registerSWCode,
    });

    // 4. 生成 manifest.json
    if (config.manifest) {
      api.onGenerate((gen) => {
        gen.addEntryCode(`// PWA manifest will be generated at build time`);
      });
    }
  };
}
```

实际上，上面的实现需要重新思考。`vite-plugin-pwa` 是一个 Vite 插件，不是 BuildPlugin。我们需要把它注册到 Vite 插件链中。

### 3.4 修正后的架构

```
┌─────────────────────────────────────────┐
│          用户 vite.config.ts              │
│                                          │
│  import { pwa } from 'deer-mobile';      │
│                                          │
│  export default defineConfig({           │
│    plugins: [                            │
│      pwa({                               │
│        enabled: true,                    │
│        manifest: { name: 'My App' },     │
│      }),                                 │
│      deer({ ... }),                      │
│    ],                                    │
│  })                                      │
└─────────────────────────────────────────┘
```

**更优方案**: `pwa()` 本身就是一个 **Vite 插件**（而不是 BuildPlugin），它：

1. 内部使用 `vite-plugin-pwa`
2. 自动集成 deer-mobile 的配置体系
3. 在构建时生成 SW + manifest
4. 提供开箱即用的离线支持

```typescript
// packages/deer-mobile/plugins/pwa-plugin/index.ts
import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin } from 'vite';
import type { PWAOptions } from '../../src/build/types';

export default function pwaPlugin(options?: PWAOptions): Plugin {
  const config = options || {};
  if (!config.enabled) {
    return { name: 'deer:pwa', apply: 'build' } as Plugin;
  }

  // 默认值
  const manifest = {
    name: config.manifest?.name || 'Deer App',
    short_name: config.manifest?.short_name || 'Deer',
    description: config.manifest?.description || 'Powered by Deer Mobile',
    theme_color: config.manifest?.theme_color || '#1890ff',
    background_color: config.manifest?.background_color || '#ffffff',
    display: config.manifest?.display || 'standalone',
    icons: config.manifest?.icons || [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    ...config.manifest,
  };

  return VitePWA({
    registerType: config.registerSW !== false ? 'autoUpdate' : 'prompt',
    includeAssets: ['favicon.svg', 'icons.svg'],
    manifest,
    workbox: {
      globPatterns: config.workbox?.globPatterns || ['**/*.{js,css,html,svg,png}'],
      runtimeCaching: config.workbox?.runtimeCaching || [
        // 默认 API 请求缓存策略
        {
          urlPattern: /\/api\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
          },
        },
      ],
      ...config.workbox,
    },
  });
}
```

### 3.5 运行时离线页面

```
┌─────────────────────────────────────────────┐
│  内置 offline 页面（virtual:builtin/offline）  │
│                                              │
│  显示内容：                                    │
│  - 离线图标                                  │
│  - "网络开小差了" 提示文案                     │
│  - "重试" 按钮 → 检查 navigator.onLine 重试  │
│  - 引导用户检查网络连接                        │
└─────────────────────────────────────────────┘
```

### 3.6 用户端使用方式

#### 基础用法（推荐）

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { deer, pwa } from 'deer-mobile';

export default defineConfig({
  plugins: [
    deer({
      config: {
        title: 'My App',
        loading: { mode: 'top' },
      },
      // env, runtimePlugins...
    }),

    // PWA — 零配置开箱即用
    pwa({ enabled: true }),
  ],
});
```

#### 完整配置

```typescript
pwa({
  enabled: true,
  manifest: {
    name: 'Deer Mobile App',
    short_name: 'Deer',
    description: '企业级移动端应用',
    theme_color: '#1890ff',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    runtimeCaching: [
      {
        urlPattern: /\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
    ],
  },
})
```

---

## 四、实施步骤

### Step 1: 添加依赖

- 在 `packages/deer-mobile/package.json` 中添加 `vite-plugin-pwa` 作为 peerDependencies
- 在根 `package.json` 中添加 `vite-plugin-pwa` 作为 devDependencies

### Step 2: 定义 PWAOptions 类型

- 文件: [`packages/deer-mobile/src/build/types.ts`](../packages/deer-mobile/src/build/types.ts)
- 新增 `PWAOptions` 接口

### Step 3: 实现 pwaPlugin

- 文件: 新建 [`packages/deer-mobile/plugins/pwa-plugin/index.ts`](../packages/deer-mobile/plugins/pwa-plugin/index.ts)
- 封装 `vite-plugin-pwa`，提供 deer-mobile 默认配置

### Step 4: 内置 offline 页面

- 在 [`builtin-plugin`](../packages/deer-mobile/plugins/builtin-plugin/index.ts) 中注册 offline 虚拟模块
- 显示离线提示 + 重试按钮

### Step 5: 导出 pwa 插件

- 文件: [`packages/deer-mobile/index.ts`](../packages/deer-mobile/index.ts)
- 添加 `export { default as pwa } from './plugins/pwa-plugin';`

### Step 6: 更新 create-deer-mobile 模板

- 在模板的 `vite.config.ts` 中添加 `pwa({ enabled: true })` 示例
- 添加默认的 `public/icons/` 目录（占位图标）

### Step 7: 更新文档

- 更新 [`plans/framework-comparison.md`](../plans/framework-comparison.md)

---

## 五、注意事项

### 5.1 SW 更新策略

| 注册模式 | 行为 | 适用场景 |
|---------|------|---------|
| `autoUpdate`（默认） | 新 SW 安装后立即激活 | 大多数应用 |
| `prompt` | 提示用户确认更新 | 需要用户感知更新的场景 |

### 5.2 开发体验

- `vite-plugin-pwa` 在开发模式下提供一个 virtual SW 用于测试
- 不支持热更新 SW，每次修改需要硬刷新
- 建议开发时 `enabled: false`，仅在生产环境启用

### 5.3 缓存策略选择

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| `NetworkFirst` | 优先网络，失败回退缓存 | API 请求（默认） |
| `CacheFirst` | 优先缓存，没有则网络 | 静态图片、字体 |
| `StaleWhileRevalidate` | 缓存立即返回，后台更新 | 非关键资源 |
| `NetworkOnly` | 仅网络，不使用缓存 | 敏感数据接口 |
| `CacheOnly` | 仅缓存，不请求网络 | 离线专用页面 |

### 5.4 安全

- Service Worker **仅能在 HTTPS 或 localhost 下注册**
- 不能缓存用户敏感数据（token、个人信息）
- 建议合理设置缓存过期时间，避免展示过期数据
