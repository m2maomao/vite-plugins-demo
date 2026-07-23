# Plugin System Redesign — Deer Mobile 企业级插件系统（v5 最终版）

> 目标：构建**企业级**插件系统，完整对标 Umi 4 插件架构
> 一次性做到位，不留技术债

---

## 零、参考：Umi 4 插件系统全貌

### Umi 的核心设计

```
Umi 4 Plugin System
├── Preset Layer（预设层）
│   └── @umijs/preset-umi ← Umi 自身就是一个 Preset
│       ├── plugin-1 (routes)
│       ├── plugin-2 (config)
│       └── plugin-3 (mock)
│
├── Plugin Layer（插件层）
│   └── export default (api: IApi) => { ... }
│       ├── api.describe()          描述插件
│       ├── api.registerMethod()    注册共享方法
│       ├── api.modifyConfig()      修改配置
│       ├── api.modifyRoutes()      修改路由
│       └── api.addRuntimePlugin()  注册运行时插件
│
└── Runtime Layer（运行时层）
    └── export function rootContainer(container) { ... }
        export function onRouteChange({ routes, location }) { ... }
        export function patchRoutes({ routes }) { ... }
```

### Umi 的关键机制

| 机制 | 说明 |
|------|------|
| **Preset** | 一组插件的集合。Umi 自身就是 Preset，内部包含几十个插件 |
| **插件解析** | Umi 自动从 `node_modules` 解析 `@umijs/preset-*` 和 `@umijs/plugin-*` |
| **describe()** | 插件声明自己的 id、配置 key、Schema |
| **registerMethod()** | 插件可以注册方法让其他插件调用，实现插件间协作 |
| **addRuntimePlugin()** | Build Plugin 在构建时注册 Runtime Plugin |
| **Service API** | `addEntryCode`, `addHTMLScript`, `addBeforeMiddlewares` 等 50+ API |
| **生命周期** | `onPluginReady` → `modifyConfig` → `modifyRoutes` → `addTmpFiles` → `onBuildComplete` |

---

## 一、Deer Mobile 企业级插件架构

### 1.1 四层架构

```
┌═══════════════════════════════════════════════════════════════════════┐
║                                                                       ║
║  ┌─ Layer 0: Preset ─────────────────────────────────────────────┐   ║
║  │                                                                │   ║
║  │  定义: Preset = BuildPlugin 的集合                              │   ║
║  │  用途: 分发一组相关插件（框架自身、业务线预设）                      │   ║
║  │                                                                │   ║
║  │  deer-mobile 自身就是一个 Preset：                                │   ║
║  │    deer:preset → [deer:config, deer:routes, deer:api, ...]     │   ║
║  │                                                                │   ║
║  │  @company/mobile-preset → [auth, permission, analytics, ...]   │   ║
║  │                                                                │   ║
║  ├────────────────────────────────────────────────────────────────┤   ║
║  │  Preset 接口:                                                   │   ║
║  │    type Preset = BuildPlugin[] | ((api: BuildAPI) => void)     │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
║                          │ 展开                                        ║
║                          ▼                                            ║
║  ┌─ Layer 1: BuildPlugin ────────────────────────────────────────┐   ║
║  │                                                                │   ║
║  │  定义: (api: BuildAPI) => void                                 │   ║
║  │  运行: Node.js 构建时                                           │   ║
║  │  发布: npm 包                                                  │   ║
║  │                                                                │   ║
║  │  生命周期:                                                      │   ║
║  │    describe() → onInit() → modifyConfig()                      │   ║
║  │    → modifyRoutes() → onGenerate()                             │   ║
║  │    → onBuildComplete()                                         │   ║
║  │                                                                │   ║
║  │  Service API:                                                   │   ║
║  │    addRuntimePlugin()   addEntryCode()                         │   ║
║  │    addHTMLScript()      addBeforeMiddlewares()                 │   ║
║  │    registerMethod()     callMethod()                           │   ║
║  │    addPluginExports()   addTmpGenerateWatcherPaths()           │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
║                          │ 注册                                        ║
║                          ▼                                            ║
║  ┌─ Layer 2: RuntimePlugin ──────────────────────────────────────┐   ║
║  │                                                                │   ║
║  │  定义: { name, hooks } 对象                                    │   ║
║  │  运行: Browser 运行时                                           │   ║
║  │                                                                │   ║
║  │  钩子:                                                          │   ║
║  │    onAppCreated → onRouterCreated → onRouterReady              │   ║
║  │    → onBeforeMount → onMounted                                 │   ║
║  │    → rootContainer → innerProvider → outerProvider             │   ║
║  │    → patchRoutes → onHistoryChange                              │   ║
║  │    → onPageEnter → onPageLeave → onRouteChange                 │   ║
║  │    → onError                                                   │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
║                          │ 管理                                        ║
║                          ▼                                            ║
║  ┌─ Layer 3: PluginManager ──────────────────────────────────────┐   ║
║  │                                                                │   ║
║  │  职责: 注册、排序、执行 RuntimePlugin                             │   ║
║  │  提供: RuntimeContext（addRoute / setLayout / ...）              │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 1.2 配置模型（先搞清楚"在哪配"）

很多框架新手会把"插件配置在哪"和"vite.config.ts 在哪"搞混，这里先理清楚。

#### 配置分两层

```
┌──────────────────────────────────────────────────────────────────┐
│  A: vite.config.ts  ← 声明层                                      │
│                                                                    │
│  这里写: 用什么插件（import + 注册）                                  │
│  这里写: 基础框架配置（title、theme、baseURL 等）                      │
│                                                                    │
│  这是"项目构建配置"，由 Vite 读取。                                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │ deer() 内部自动合并
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  B: AppConfig  ← 运行时配置对象                                    │
│                                                                    │
│  传给: PluginManager → RuntimePlugin 通过 ctx.config 读取           │
│  也传给: virtual:app-config → 页面代码中 import 使用                │
│                                                                    │
│  结构:                                                              │
│    {                                                               │
│      title: 'My App',           ← 框架自身字段                      │
│      theme: { ... },                                                │
│      request: { baseURL: ... },                                     │
│      sentry: { dsn: '...' },    ← sentry 插件通过                  │
│      auth: { tokenKey: '...' },  ← describe({ key: 'auth' }) 声明  │
│      analytics: { ... },        ← analytics 插件声明                │
│    }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

#### 一个插件的完整配置流程

```typescript
// ===== 第 1 步：插件开发者声明配置 key =====
// deer-plugin-sentry/index.ts
export default function sentryPlugin(api: BuildAPI) {
  api.describe({
    id: 'deer:sentry',
    key: 'sentry',           // ← 声明：我的配置在 config.sentry 下
    configSchema: {
      dsn: { type: 'string', required: true },
      environment: { type: 'string', default: 'production' },
    },
  });

  api.onAppCreated(app, ctx) {
    // ctx.config.sentry.dsn  ← 运行时从这里读取
    Sentry.init({ dsn: ctx.config.sentry.dsn });
  }
}

// ===== 第 2 步：用户在 deer() 中配置 =====
// vite.config.ts
export default defineConfig({
  plugins: [
    deer({
      config: {
        title: 'My App',
        theme: { primaryColor: '#1677ff' },
        sentry: {                              // ← key 为 'sentry'
          dsn: 'https://xxx@xxx.ingest.sentry.io/xxx',
          environment: 'staging',
        },
        auth: {                                // ← key 为 'auth'
          tokenKey: 'access_token',
        },
      },
      buildPlugins: [
        sentryPlugin,   // ← 声明启用 sentry 插件
      ],
      runtimePlugins: [
        authPlugin(),    // ← 声明启用 auth 运行时插件
      ],
    }),
  ],
});

// ===== 第 3 步：框架内部流程 =====
// BuildPlugin 执行 modifyConfig 时，api.getConfig() 返回合并后的对象
// {
//   title: 'My App',
//   theme: { primaryColor: '#1677ff' },
//   sentry: { dsn: 'https://...', environment: 'staging' },
//   auth: { tokenKey: 'access_token' },
// }

// ===== 第 4 步：运行时使用 =====
// RuntimePlugin 通过 ctx.config 读取配置
// 页面代码通过 import { appConfig } from 'virtual:app-config' 读取
```

#### 当前写法 vs 新写法对比

```typescript
// ═══ 当前的写法（v0.1.31）═══
// 每个插件是独立的 Vite 插件，配置分散在各处
plugins: [
  scanPagesPlugin({ pluginRoutes: [...] }),     // 路由配置
  configPlugin(                                  // AppConfig 在这里
    { title: '111', theme: { ... } },
    [piniaPlugin, i18nPlugin],                  // 插件注册也在这里
  ),
  setupPlugin(),                                 // 读全局变量
  apiPlugin(),                                   // 独立
  builtinPlugin(),                               // 独立
  authPlugin(),                                  // 独立
  mockPlugin({ enabled: true }),                 // Mock 配置在这里
]

// ═══ 新写法（v5）═══
// 所有 Deer 相关统一在 deer() 中，一个入口，结构清晰
plugins: [
  deer({
    // 框架配置 + 所有插件配置，都在 config 下
    config: {
      title: '111',
      theme: { primaryColor: 'red', darkMode: true },
      mock: { enabled: true },                // mock 配置
    },

    // 路由配置
    routes: {
      pluginRoutes: [
        { path: '/login', file: 'virtual:builtin/login' },
        { path: '/:pathMatch(.*)*', file: 'virtual:builtin/404' },
      ],
    },

    // 构建时插件
    buildPlugins: [sentryPlugin, companyPreset],

    // 运行时插件
    runtimePlugins: [piniaPlugin(), authPlugin(), i18nPlugin()],
  }),
]
```

---

### 1.3 Preset 机制

```typescript
// ===== Preset 定义 =====

/** Preset = 一组 BuildPlugin 的集合 */
export type Preset = BuildPlugin[] | ((api: BuildAPI) => void);

// ===== 框架自身就是一个 Preset =====

// packages/deer-mobile/src/presets/default.ts
export const defaultPreset: Preset = [
  configPlugin,     // deer:config
  routesPlugin,     // deer:routes
  apiPlugin,        // deer:api
  builtinPlugin,    // deer:builtin
  mockPlugin,       // deer:mock
  authBuildPlugin,  // deer:auth-build
];

// ===== 用户自定义 Preset 示例 =====

// @company/mobile-preset/index.ts
import { BuildAPI, Preset } from 'deer-mobile';
import sentryPlugin from 'deer-plugin-sentry';

const companyPreset: Preset = [
  // 引入第三方插件
  sentryPlugin,

  // 公司内部插件
  (api: BuildAPI) => {
    api.describe({ id: 'company:analytics', key: 'analytics' });

    api.addHTMLHeadScript({
      src: 'https://cdn.company.com/analytics.js',
    });

    api.addRuntimePlugin({
      name: 'company:analytics',
      priority: 20,
      onRouteChange(to) {
        window.analytics?.page(to.path);
      },
    });
  },
];

// ===== 注册 Preset 的另一种方式（函数形式） =====
export default function companyPresetFn(api: BuildAPI) {
  // 注册多个插件
  api.registerPlugin(sentryPlugin);
  api.registerPlugin(analyticsPlugin);
  api.registerPlugin(permissionPlugin);
}
```

### 1.3 插件解析机制

支持从 npm 包名自动解析插件：

```typescript
// deer() 内部实现

function resolvePlugins(rawPlugins: PluginInput[]): BuildPlugin[] {
  return rawPlugins.map((input) => {
    if (typeof input === 'function') {
      // 直接传入的 BuildPlugin 函数
      return input;
    }
    if (Array.isArray(input)) {
      // Preset（BuildPlugin 数组）
      return input;
    }
    if (typeof input === 'string') {
      // npm 包名，自动 resolve
      // 'deer-plugin-sentry' → require('deer-plugin-sentry')
      // '@company/deer-plugin-permission' → require('@company/deer-plugin-permission')
      return resolveNpmPlugin(input);
    }
    return input;
  });
}
```

---

## 二、完整类型定义

### 2.1 BuildPlugin + BuildAPI

```typescript
// packages/deer-mobile/src/build/types.ts

// ===== Preset =====

/** Preset = BuildPlugin 的集合 */
export type Preset = BuildPlugin[] | ((api: BuildAPI) => void);

// ===== BuildPlugin =====

/** 构建时插件：函数形式，接收 BuildAPI */
export type BuildPlugin = (api: BuildAPI) => void | Promise<void>;

// ===== PluginDescriptor =====

export interface PluginDescriptor {
  /** 插件唯一标识 */
  id: string;
  /** 在 AppConfig 中的配置 key */
  key?: string;
  /** 默认启用 */
  enable?: boolean;
  /** 配置 Schema（使用 zod 或简单校验规则） */
  configSchema?: Record<string, unknown>;
  /** 依赖的其他插件 id 列表 */
  dependencies?: string[];
}

// ===== BuildAPI — 构建时插件可用的全部 API =====

export interface BuildAPI {
  // ========== 1. 插件描述 ==========

  describe(descriptor: PluginDescriptor): void;

  // ========== 2. 生命周期钩子 ==========

  /** 插件初始化 */
  onInit(fn: () => void | Promise<void>): void;

  /** 修改 AppConfig */
  modifyConfig(fn: (config: AppConfig) => AppConfig | void): void;

  /** 修改路由表 */
  modifyRoutes(
    fn: (routes: RouteConfig[]) => RouteConfig[] | void,
  ): void;

  /** 代码生成前回调 */
  onGenerate(fn: (gen: GenerateAPI) => void | Promise<void>): void;

  /** 构建完成回调（成功后调用） */
  onBuildComplete(
    fn: (info: { duration: number; routes: RouteConfig[] }) => void,
  ): void;

  /** 开发环境编译完成回调 */
  onDevCompileDone(
    fn: (info: { duration: number; isFirstCompile: boolean }) => void,
  ): void;

  // ========== 3. Service API ==========

  /** 注册运行时插件 */
  addRuntimePlugin(
    plugin: RuntimePlugin | (() => RuntimePlugin),
  ): void;

  /** 注入代码到 runtime entry */
  addEntryCode(code: string, options?: { ahead?: boolean }): void;

  /** 注入 import 语句 */
  addImport(specifier: string, source: string): void;

  /** 向 HTML 注入 script */
  addHTMLScript(script: ScriptConfig): void;

  /** 向 HTML <head> 注入 script */
  addHTMLHeadScript(script: ScriptConfig): void;

  /** 添加 Vite Dev Server 中间件 */
  addBeforeMiddlewares(
    middleware: (req: any, res: any, next: any) => void,
  ): void;

  /** 添加模板生成监听路径（用于开发时热更新） */
  addTmpGenerateWatcherPaths(paths: string[]): void;

  /** 注册一个 npm 依赖信息 */
  addDepInfo(dep: { name: string; version: string; type: string }): void;

  // ========== 4. 插件注册（在 Preset 函数中使用） ==========

  /** 在插件内部注册另一个插件 */
  registerPlugin(plugin: BuildPlugin | Preset): void;

  // ========== 5. 插件间通信 ==========

  /** 注册一个方法供其他插件调用 */
  registerMethod(
    name: string,
    fn: (...args: any[]) => any,
  ): void;

  /** 调用其他插件注册的方法 */
  callMethod(name: string, ...args: any[]): any;

  /** 判断方法是否存在 */
  hasMethod(name: string): boolean;

  // ========== 6. 工具 ==========

  /** 获取当前 AppConfig */
  getConfig(): AppConfig;

  /** 获取当前路由表 */
  getRoutes(): RouteConfig[];

  /** 获取已注册的所有 RuntimePlugin */
  getRuntimePlugins(): RuntimePlugin[];

  /** 日志 */
  logger: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };
}

// ===== GenerateAPI =====

export interface GenerateAPI {
  addEntryCode(code: string, options?: { ahead?: boolean }): void;
  addImport(specifier: string, source: string): void;
  getState(): {
    config: AppConfig;
    routes: RouteConfig[];
    runtimePlugins: RuntimePlugin[];
  };
}

// ===== ScriptConfig =====

export interface ScriptConfig {
  src?: string;
  content?: string;
  attrs?: Record<string, string>;
  async?: boolean;
  defer?: boolean;
}
```

### 2.2 RuntimePlugin — 完整版

```typescript
// packages/deer-mobile/src/runtime/types.ts

export interface RuntimePlugin {
  /** 插件名称 */
  name: string;
  /** 优先级（数字越小越先执行），默认 10 */
  priority?: number;

  // ===== 应用生命周期 =====

  /** App 创建后调用 */
  onAppCreated?: (
    app: App,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  /** Router 创建后调用 */
  onRouterCreated?: (
    router: Router,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  /** Router isReady 后调用 */
  onRouterReady?: (
    router: Router,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  /** 挂载前调用 */
  onBeforeMount?: (
    app: App,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  /** 挂载完成后调用 */
  onMounted?: (ctx: RuntimeContext) => void | Promise<void>;

  // ===== Provider 机制 =====

  /** 包裹根组件（用于 ThemeProvider/StoreProvider 等） */
  rootContainer?: (
    container: () => VNode,
    ctx: RuntimeContext,
  ) => VNode | (() => VNode);

  /** 内层 Provider */
  innerProvider?: (container: () => VNode) => VNode;

  /** 外层 Provider */
  outerProvider?: (container: () => VNode) => VNode;

  // ===== 页面生命周期 =====

  /** 进入页面 */
  onPageEnter?: (
    route: RouteLocationNormalized,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  /** 离开页面 */
  onPageLeave?: (
    route: RouteLocationNormalized,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  /** 路由变更 */
  onRouteChange?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  // ===== 运行时路由 =====

  /** 运行时修改路由 */
  patchRoutes?: (info: {
    routes: RouteRecordRaw[];
    initialState?: Record<string, unknown>;
  }) => RouteRecordRaw[] | void;

  /** 路由历史变更 */
  onHistoryChange?: (info: {
    location: Location;
    action: 'PUSH' | 'POP' | 'REPLACE';
  }) => void;

  // ===== 错误处理 =====

  /** 全局错误捕获 */
  onError?: (error: Error, ctx: RuntimeContext) => void;
}

// ===== RuntimeContext =====

export interface RuntimeContext {
  app: App;
  router: Router;
  config: AppConfig;
  data: Map<string, unknown>;

  addRouterGuard(
    type: 'beforeEach' | 'afterEach',
    guard: Function,
  ): void;
  addRoute(route: RouteRecordRaw): void;
  removeRoute(name: string): void;
  getRoutes(): RouteRecordNormalized[];
  addLayout(name: string, component: Component): void;
  setLayout(name: string): void;
}
```

### 2.3 setup-plugin 配置选项

```typescript
// packages/deer-mobile/plugins/setup-plugin/types.ts

export interface DeerOptions {
  // ===== App 配置 =====
  config?: Partial<AppConfig>;

  // ===== 路由 =====
  routes?: {
    pluginRoutes?: RouteConfig[];
  };

  // ===== Mock =====
  mock?: MockPluginOptions;

  // ===== 插件系统 =====

  /** Preset 列表（一组 BuildPlugin 的集合） */
  presets?: Preset[];

  /** 构建时插件列表 */
  buildPlugins?: BuildPlugin[];

  /** 运行时插件列表 */
  runtimePlugins?: RuntimePlugin[];

  /** 构建时配置回调（内部转为匿名 BuildPlugin） */
  modifyRoutes?: (
    routes: RouteConfig[],
  ) => RouteConfig[] | void;
  modifyConfig?: (
    config: AppConfig,
  ) => AppConfig | void;
  onGenerate?: (api: GenerateAPI) => void | Promise<void>;
}
```

---

## 三、完整插件清单

### 3.1 框架内置 Preset（1 个）

| Preset ID | 文件 | 包含的插件 |
|-----------|------|-----------|
| `deer:preset` | `src/presets/default.ts` | config, routes, api, builtin, mock, auth-build |

### 3.2 框架内置 BuildPlugin（6 个）

| # | 插件 ID | 作为 Preset 的子插件 | 职责 |
|---|---------|---------------------|------|
| 1 | `deer:config` | ✅ | 配置管理 |
| 2 | `deer:routes` | ✅ | 路由扫描 |
| 3 | `deer:api` | ✅ | API 扫描 |
| 4 | `deer:builtin` | ✅ | 内置页面 |
| 5 | `deer:mock` | ✅ | Mock API |
| 6 | `deer:auth-build` | ✅ | 认证路由注入 |

### 3.3 框架内置 RuntimePlugin（4 个）

| # | 插件名 | 优先级 | 钩子 |
|---|--------|--------|------|
| 1 | `deer:pinia` | 0 | `onAppCreated` |
| 2 | `deer:auth` | 1 | `onRouterCreated` |
| 3 | `deer:i18n` | 5 | `onAppCreated`, `onRouterCreated` |
| 4 | `deer:api` | 10 | `onAppCreated` |

---

## 四、Umi 对标 — 能力全覆盖

| 能力分类 | 具体能力 | Umi 4 | Deer v5 | 实现方式 |
|---------|---------|-------|---------|---------|
| **Preset** | 插件集合分发 | ✅ | ✅ | `Preset = BuildPlugin[]` |
| **Preset** | 框架自身是 Preset | ✅ | ✅ | `deer:preset` 内置 |
| **Preset** | 嵌套 Preset | ✅ | ✅ | Preset 可包含 Preset |
| **插件注册** | Function(api) 形式 | ✅ | ✅ | `BuildPlugin = (api) => {}` |
| **插件注册** | npm 包名解析 | ✅ | ✅ | `resolveNpmPlugin()` |
| **插件注册** | 插件内注册子插件 | ✅ | ✅ | `api.registerPlugin()` |
| **插件描述** | describe(id, key) | ✅ | ✅ | `api.describe()` |
| **插件描述** | 配置 Schema 校验 | ✅ | ✅ | zod 兼容 |
| **插件描述** | 依赖声明 | ✅ | ✅ | `dependencies: []` |
| **生命周期** | onInit | ✅ | ✅ | `api.onInit()` |
| **生命周期** | modifyConfig | ✅ | ✅ | `api.modifyConfig()` |
| **生命周期** | modifyRoutes | ✅ | ✅ | `api.modifyRoutes()` |
| **生命周期** | onGenerate | ✅ | ✅ | `api.onGenerate()` |
| **生命周期** | onBuildComplete | ✅ | ✅ | `api.onBuildComplete()` |
| **生命周期** | onDevCompileDone | ✅ | ✅ | `api.onDevCompileDone()` |
| **Service** | addRuntimePlugin | ✅ | ✅ | `api.addRuntimePlugin()` |
| **Service** | addEntryCode | ✅ | ✅ | `api.addEntryCode()` |
| **Service** | addEntryCodeAhead | ✅ | ✅ | `options.ahead` |
| **Service** | addHTMLScript | ✅ | ✅ | `api.addHTMLScript()` |
| **Service** | addHTMLHeadScript | ✅ | ✅ | `api.addHTMLHeadScript()` |
| **Service** | addBeforeMiddlewares | ✅ | ✅ | `api.addBeforeMiddlewares()` |
| **Service** | addTmpGenerateWatcherPaths | ✅ | ✅ | `api.addTmpGenerateWatcherPaths()` |
| **Service** | addDepInfo | ✅ | ✅ | `api.addDepInfo()` |
| **插件通信** | registerMethod | ✅ | ✅ | `api.registerMethod()` |
| **插件通信** | callMethod | ✅ | ✅ | `api.callMethod()` |
| **插件通信** | hasMethod | ✅ | ✅ | `api.hasMethod()` |
| **运行时** | rootContainer | ✅ | ✅ | 包裹根组件 Provider |
| **运行时** | innerProvider | ✅ | ✅ | 内层 Provider |
| **运行时** | outerProvider | ✅ | ✅ | 外层 Provider |
| **运行时** | patchRoutes | ✅ | ✅ | 运行时动态路由 |
| **运行时** | onHistoryChange | ✅ | ✅ | History API 变化 |
| **运行时** | onRouteChange | ✅ | ✅ | 路由变化 |
| **运行时** | onPageEnter/Leave | ✅ | ✅ | 页面进出 |
| **运行时** | onError | ✅ | ✅ | 错误捕获 |
| **运行机制** | 优先级排序 | ✅ | ✅ | `priority` 字段 |
| **运行机制** | 插件间数据共享 | ✅ | ✅ | `ctx.data` Map |
| **运行机制** | 异步初始化 | ✅ | ✅ | `async` 支持 |

**结论：Deer Mobile v5 在能力上已完整对标 Umi 4，无差距。**

---

## 五、用户最终使用示例

### 最简单的用法

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { deer } from 'deer-mobile';

export default defineConfig({
  plugins: [
    Vue(),
    deer({
      config: {
        title: 'My App',
        theme: { primaryColor: '#1677ff' },
      },
      routes: {
        pluginRoutes: [
          { path: '/login', file: 'virtual:builtin/login' },
          { path: '/:pathMatch(.*)*', file: 'virtual:builtin/404' },
        ],
      },
      runtimePlugins: [
        piniaPlugin(),
        authPlugin(),
        i18nPlugin(),
      ],
    }),
  ],
});
```

### 企业级用法（含 Preset、npm 插件、插件通信）

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { deer } from 'deer-mobile';

// npm 包插件
import sentryPlugin from 'deer-plugin-sentry';

// 公司内部 Preset（一组插件的集合）
import companyPreset from '@company/deer-mobile-preset';

// 自定义 BuildPlugin
function myBuildPlugin(api: BuildAPI) {
  api.describe({ id: 'my:build-plugin', key: 'myPlugin' });

  api.onInit(() => {
    console.log('插件初始化');
  });

  api.modifyConfig((config) => ({
    ...config,
    title: config.title + ' (Enterprise)',
  }));

  // 注册方法给其他插件用
  api.registerMethod('getMyData', () => ({ version: '1.0.0' }));

  api.onBuildComplete(({ duration }) => {
    console.log(`构建完成，耗时 ${duration}ms`);
  });

  api.addRuntimePlugin({
    name: 'my:runtime',
    priority: 99,
    onAppCreated(app) {
      console.log('My runtime plugin loaded');
    },
    onRouteChange(to) {
      console.log('Route:', to.path);
    },
  });
}

export default defineConfig({
  plugins: [
    Vue(),

    deer({
      config: {
        title: 'Enterprise App',
        base: '/app/',
      },

      mock: { enabled: true },

      // Preset 机制：一组插件的集合
      presets: [
        companyPreset,
      ],

      // 单个 BuildPlugin
      buildPlugins: [
        sentryPlugin,
        myBuildPlugin,
      ],

      // RuntimePlugin
      runtimePlugins: [
        piniaPlugin(),
        authPlugin(),
        i18nPlugin(),
      ],

      // 配置回调（语法糖，内部转为匿名 BuildPlugin）
      modifyRoutes(routes) {
        return routes.filter(r => r.path !== '/old-page');
      },
    }),
  ],
});
```

### 分发 Preset 给全公司用

```typescript
// @company/deer-mobile-preset/index.ts
// 这是公司内部共享的 Preset npm 包

import { BuildAPI, Preset } from 'deer-mobile';

// Preset = BuildPlugin 数组
const companyPreset: Preset = [
  // 认证
  (api: BuildAPI) => {
    api.describe({
      id: 'company:auth',
      key: 'auth',
      dependencies: ['deer:config'],
    });

    api.modifyConfig((config) => ({
      ...config,
      noNavPages: [...(config.noNavPages || []), '/login', '/register'],
    }));

    api.addRuntimePlugin({
      name: 'company:auth',
      priority: 1,
      onRouterCreated(router, ctx) {
        router.beforeEach((to) => {
          const token = localStorage.getItem(ctx.config.auth?.tokenKey || 'token');
          const noAuthPages = ['/login', '/register', '/404'];
          if (!token && !noAuthPages.includes(to.path)) {
            return '/login';
          }
        });
      },
    });
  },

  // 权限管理（依赖 auth 插件）
  (api: BuildAPI) => {
    api.describe({
      id: 'company:permission',
      key: 'permission',
      dependencies: ['company:auth'],
    });

    api.modifyRoutes((routes) => {
      // 根据权限配置过滤路由（构建时）
      return routes;
    });

    api.addRuntimePlugin({
      name: 'company:permission',
      priority: 2,
      patchRoutes({ routes }) {
        // 运行时根据用户角色过滤路由
        const userRole = localStorage.getItem('role');
        return routes.filter(r => !r.meta?.roles || r.meta.roles.includes(userRole));
      },
    });
  },

  // 日志上报
  (api: BuildAPI) => {
    api.describe({ id: 'company:logger', key: 'logger' });

    api.onBuildComplete(({ duration }) => {
      // 构建完成上报
      fetch('/api/build-log', {
        method: 'POST',
        body: JSON.stringify({ duration, status: 'success' }),
      });
    });

    api.onDevCompileDone(({ duration, isFirstCompile }) => {
      console.log(`[HMR] 重新编译耗时 ${duration}ms`);
    });
  },
];

export default companyPreset;
```

---

## 六、完整启动流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                     构建时 Build Phase                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. deer() 被调用                                                    │
│     ├── 展开 presets → 得到 BuildPlugin 列表                          │
│     ├── 合并 buildPlugins + presets 展开结果                          │
│     ├── 按 dependencies 拓扑排序                                      │
│     └── 将 modifyRoutes/modifyConfig 转为匿名 BuildPlugin            │
│                                                                     │
│  2. 执行 BuildPlugin.describe()                                      │
│     ├── 收集所有插件的 id、key、Schema                                 │
│     └── 校验 dependencies 是否满足                                    │
│                                                                     │
│  3. 执行 BuildPlugin.onInit()                                        │
│     ├── config-plugin 注册 virtual:app-config                        │
│     ├── routes-plugin 扫描 pages 目录                                │
│     ├── api-plugin 扫描 src/api                                      │
│     ├── builtin-plugin 注册内置页面                                  │
│     └── mock-plugin 注册 Dev Server 中间件                           │
│                                                                     │
│  4. 执行 modifyConfig (按 priority)                                  │
│     └── 合并 → 最终 AppConfig                                       │
│                                                                     │
│  5. 执行 modifyRoutes (按 priority)                                  │
│     └── 合并 → 最终路由表                                           │
│                                                                     │
│  6. 执行 onGenerate                                                  │
│     ├── 收集所有 addRuntimePlugin 注册的 RuntimePlugin                │
│     ├── 收集所有 addEntryCode / addImport                            │
│     └── 生成 virtual:setup-app                                       │
│                                                                     │
│  7. 执行 onBuildComplete                                             │
│     └── 日志上报 / CI 通知等                                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                     运行时 Runtime Phase                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  8. 浏览器加载 virtual:setup-app                                     │
│     │                                                               │
│     ├── PluginManager 初始化                                         │
│     │                                                                │
│     ├── onAppCreated (priority: 0, 1, 5, 10, ..., 99)              │
│     │    deer:pinia  → createPinia                                  │
│     │    deer:i18n   → createI18n                                    │
│     │    deer:api    → inject $api                                   │
│     │    my:runtime  → console.log('loaded')                         │
│     │                                                                │
│     ├── createRouter()                                               │
│     │                                                                │
│     ├── onRouterCreated                                              │
│     │    deer:auth → router.beforeEach                               │
│     │    deer:i18n → watch(locale)                                   │
│     │                                                                │
│     ├── router.isReady()                                             │
│     ├── onRouterReady                                                │
│     │                                                                │
│     ├── rootContainer 嵌套 (外→内)                                   │
│     │    outerProvider: SentryProvider                                │
│     │    innerProvider: ThemeProvider                                 │
│     │    rootContainer: AnalyticsProvider                             │
│     │                                                                │
│     ├── onBeforeMount                                                │
│     ├── app.mount('#app')                                            │
│     └── onMounted                                                    │
│                                                                     │
│  9. 页面切换                                                         │
│     ├── onPageLeave(旧路由)                                          │
│     ├── patchRoutes (可选，动态调整路由)                              │
│     ├── onRouteChange(新路由, 旧路由)                                │
│     └── onPageEnter(新路由)                                          │
│                                                                     │
│  10. 错误发生                                                        │
│      └── onError(error)                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 七、文件结构

```
packages/deer-mobile/
│
├── src/
│   ├── build/
│   │   ├── types.ts          ← BuildPlugin, BuildAPI, GenerateAPI, PluginDescriptor
│   │   ├── schema.ts         ← 配置校验工具
│   │   └── index.ts          ← 导出
│   │
│   ├── runtime/
│   │   ├── types.ts          ← RuntimePlugin, RuntimeContext
│   │   ├── plugin-manager.ts ← PluginManager 类
│   │   ├── create-app.ts     ← createRuntimeApp 函数
│   │   └── index.ts          ← 导出
│   │
│   ├── presets/
│   │   └── default.ts        ← deer:preset（框架内置 6 个 BuildPlugin）
│   │
│   └── utils/
│       └── plugin-resolver.ts ← npm 包名解析
│
├── plugins/
│   ├── build/                ← BuildPlugin（Function(api) 形式）
│   │   ├── config-plugin.ts     deer:config
│   │   ├── scan-plugin.ts       deer:routes
│   │   ├── api-plugin.ts        deer:api
│   │   ├── builtin-plugin.ts    deer:builtin
│   │   ├── mock-plugin.ts       deer:mock
│   │   └── auth-build-plugin.ts deer:auth-build
│   │
│   ├── runtime/              ← RuntimePlugin（对象形式）
│   │   ├── pinia-plugin.ts      deer:pinia
│   │   ├── auth-plugin.ts       deer:auth
│   │   ├── i18n-plugin.ts       deer:i18n
│   │   └── api-plugin.ts        deer:api
│   │
│   └── setup-plugin/         ← 唯一的 Vite 插件
│       ├── index.ts            ← deer() Vite 插件
│       ├── build-engine.ts     ← BuildPlugin 执行引擎
│       ├── code-gen.ts         ← 代码生成器
│       └── types.ts            ← DeerOptions
│
└── index.ts                  ← 导出 deer(), BuildPlugin, RuntimePlugin 等
```

---

## 八、分步实现计划

### Step 1：基础设施（类型定义 + 运行时）

| 文件 | 内容 |
|------|------|
| `src/build/types.ts` | `BuildPlugin`, `BuildAPI`, `GenerateAPI`, `PluginDescriptor`, `Preset` |
| `src/runtime/types.ts` | `RuntimePlugin`, `RuntimeContext` |
| `src/runtime/plugin-manager.ts` | `PluginManager`（含 rootContainer 处理） |
| `src/runtime/create-app.ts` | `createRuntimeApp` 函数 |
| `src/runtime/index.ts` | 导出 |
| `src/build/index.ts` | 导出 |
| `src/utils/plugin-resolver.ts` | `resolveNpmPlugin()` + `resolvePresets()` |
| `src/presets/default.ts` | deer 内置 Preset（6 个 BuildPlugin） |

### Step 2：实现 BuildPlugin（6 个）

| 顺序 | 文件 | 从旧文件迁移 |
|------|------|------------|
| 1 | `plugins/build/config-plugin.ts` | `plugins/config-plugin/index.ts` |
| 2 | `plugins/build/scan-plugin.ts` | `plugins/scan-pages-plugin/index.ts` |
| 3 | `plugins/build/api-plugin.ts` | `plugins/api-plugin/index.ts` |
| 4 | `plugins/build/builtin-plugin.ts` | `plugins/builtin-plugin/index.ts` + 修复 Bug |
| 5 | `plugins/build/mock-plugin.ts` | `plugins/mock-plugin/index.ts` |
| 6 | `plugins/build/auth-build-plugin.ts` | 新建 |

### Step 3：实现 RuntimePlugin（4 个）

| 顺序 | 文件 | 从旧文件迁移 |
|------|------|------------|
| 1 | `plugins/runtime/pinia-plugin.ts` | `plugins/pinia-plugin/index.ts` |
| 2 | `plugins/runtime/auth-plugin.ts` | `plugins/auth-plugin/index.ts` |
| 3 | `plugins/runtime/i18n-plugin.ts` | `plugins/i18n-plugin/index.ts` |
| 4 | `plugins/runtime/api-plugin.ts` | 新建 |

### Step 4：实现 setup-plugin（桥接层）

| 文件 | 内容 |
|------|------|
| `plugins/setup-plugin/types.ts` | `DeerOptions` |
| `plugins/setup-plugin/build-engine.ts` | BuildPlugin 执行引擎（生命周期编排） |
| `plugins/setup-plugin/code-gen.ts` | 代码生成器 |
| `plugins/setup-plugin/index.ts` | `deer()` Vite 插件 |

### Step 5：清理 + 导出

- 删除 `plugins/_shared.ts`, `plugins/config-plugin/FrameworkPlugin`, 旧 `auth-plugin`
- 更新 `index.ts` 导出
- 更新 `apps/example/vite.config.ts`

---

## 九、API 速查表

### BuildPlugin API

| 方法 | 参数 | 说明 |
|------|------|------|
| `describe()` | `{ id, key, configSchema, dependencies }` | 描述插件 |
| `onInit(fn)` | `() => void` | 初始化（声明虚拟模块等） |
| `modifyConfig(fn)` | `(config) => config` | 修改 AppConfig |
| `modifyRoutes(fn)` | `(routes) => routes` | 修改路由表 |
| `onGenerate(fn)` | `(gen) => void` | 代码生成前调整 |
| `onBuildComplete(fn)` | `({duration}) => void` | 构建完成 |
| `onDevCompileDone(fn)` | `({duration, isFirstCompile}) => void` | 开发编译完成 |
| `addRuntimePlugin(plugin)` | RuntimePlugin | 注册运行时插件 |
| `addEntryCode(code)` | string | 注入入口代码 |
| `addHTMLScript(config)` | ScriptConfig | 注入 HTML 脚本 |
| `addBeforeMiddlewares(fn)` | middleware function | 添加 Server 中间件 |
| `registerMethod(name, fn)` | (string, Function) | 注册共享方法 |
| `callMethod(name, ...args)` | string | 调用其他插件方法 |
| `registerPlugin(plugin)` | BuildPlugin | 注册子插件 |

### RuntimePlugin 钩子

| 钩子 | 参数 | 说明 |
|------|------|------|
| `onAppCreated` | `(app, ctx)` | App 创建 |
| `onRouterCreated` | `(router, ctx)` | Router 创建 |
| `onRouterReady` | `(router, ctx)` | Router 就绪 |
| `onBeforeMount` | `(app, ctx)` | 挂载前 |
| `onMounted` | `(ctx)` | 挂载后 |
| `rootContainer` | `(container, ctx)` => VNode | 包裹根组件 |
| `innerProvider` | `(container)` => VNode | 内层 Provider |
| `outerProvider` | `(container)` => VNode | 外层 Provider |
| `onPageEnter` | `(route, ctx)` | 进入页面 |
| `onPageLeave` | `(route, ctx)` | 离开页面 |
| `onRouteChange` | `(to, from, ctx)` | 路由变化 |
| `patchRoutes` | `({routes})` => routes | 运行时改路由 |
| `onHistoryChange` | `({location, action})` | History 变化 |
| `onError` | `(error, ctx)` | 错误捕获 |

---

## 十、与 Umi 最终对比

```
能力覆盖度:  Umi 4  ████████████████████████████████████████  100%
           Deer v5 ████████████████████████████████████████  100%

✅ 全面对标 Umi 4，无差距项
✅ 涵盖 Preset / BuildPlugin / RuntimePlugin 三层
✅ 支持 npm 包插件 / 插件间通信 / Provider 机制
✅ 支持构建时和运行时完整的生命周期钩子
✅ 一次到位，无需后续修修补补
```

**对于数百人使用的企业框架，这套设计已完整对标业界最佳实践（Umi 4），可直接进入实现阶段。**

---

## 十一、实现记录与 Bug 修复

### 当前实现状态（2026-07-23）

| 步骤 | 状态 | 说明 |
|------|------|------|
| Step 1: 基础设施 | ✅ 完成 | `build/types.ts`, `runtime/types.ts`, `plugin-manager.ts`, `create-app.ts` |
| Step 2: RuntimePlugin（4 个） | ✅ 完成 | pinia, auth, i18n, api |
| Step 3: setup-plugin | ✅ 完成 | `deer()` Vite 插件, `code-gen.ts`, `build-api.ts` |
| Step 4: 清理旧代码 | ✅ 完成 | 删除 `_shared.ts`, 清理 config-plugin |
| Step 5: 示例项目 | ✅ 完成 | `apps/example/vite.config.ts` 使用新 API |
| BuildPlugin 迁移（6 个） | ⏳ 待做 | 旧插件仍直接使用，未封装为 BuildPlugin |
| Preset 机制 | ⏳ 待做 | `presets/default.ts` 未实现 |

### 已修复 Bug 记录

#### Bug 1: ESM import 顺序
- **症状**: `Uncaught SyntaxError: Unexpected token 'const'`
- **原因**: 生成的 `virtual:setup-app` 代码中，`import` 语句在 `setupFlexible()` 调用之后
- **修复**: 将所有 `import` 提升到文件顶部

#### Bug 2: Temporal Dead Zone（TDZ）
- **症状**: `Cannot access 'page_statsPlugin' before initialization`
- **原因**: 内联插件代码在使用之后才声明
- **修复**: `code-gen.ts` 中先输出内联插件声明，再输出 `pluginManager.use()` 调用

#### Bug 3: router.isReady() 时机
- **症状**: 页面空白，路由未就绪
- **原因**: `router.isReady()` 在 `app.use(router)` 之前调用
- **修复**: 交换顺序：先 `app.use(router)` 再 `await router.isReady()`

#### Bug 4: builtinPlugin 路径计算
- **症状**: 内建页面无法加载
- **原因**: `new URL('../..', import.meta.url)` 在 built `index.js` 中指向错误目录
- **修复**: 判断路径中是否包含 `plugins/builtin-plugin` 来区分源码与构建模式

#### Bug 5: callHook 参数传递
- **症状**: 插件钩子接收不到参数
- **原因**: `callHook('onAppCreated')` 未传递 `app` 参数
- **修复**: `callHook('onAppCreated', app)` 传递正确的参数

#### Bug 6: h('router-view') 字符串标签
- **症状**: 页面内容不渲染
- **原因**: `h('router-view')` 创建 HTML 元素而非 Vue Router 组件
- **修复**: 使用 `h(RouterView)` 命名导出

#### Bug 7: CSS Cascade Layers — Vant vs Tailwind
- **症状**: 按钮 `text-white` 被 Vant 的 `button { color: inherit }` 覆盖
- **原因**: Vant CSS 通过 `@import 'vant/lib/index.css' layer(framework)` 导入，而 `@layer framework` 在 Tailwind 的 `@layer utilities` 之后声明，根据 CSS 层叠规则后声明的层优先级更高
- **修复**: 在 `@import 'tailwindcss'` 之前添加 `@layer framework {}` 空层声明，使 `framework` 层优先级低于 `utilities`：
  ```css
  @layer framework {}    /* 先声明 → 低优先级 */
  @import 'tailwindcss';  /* Tailwind 生成 utilities → 高优先级 */
  ```
- **涉及文件**: `packages/deer-mobile/src/style.css`, `apps/example/src/style.css`

#### Bug 8: h is not defined
- **症状**: `ReferenceError: h is not defined`
- **原因**: `builtinPlugin` 使用 esbuild `jsxFactory: 'h'` 生成 `h()` 调用，但入口文件未导入 `h`
- **修复**: 在内建页面源码中显式 `import { h } from 'vue'`

#### Bug 9: package.json development 条件
- **症状**: Vite 加载 built `index.js` 而非源码
- **原因**: `"."` 的 `development` 条件指向不存在的 `./src/index.ts`
- **修复**: 改为 `./index.ts`（根目录入口文件）

#### Bug 10: 构建时虚拟模块解析失败
- **症状**: `pnpm build` 报错 `Could not resolve "virtual:app-config"`
- **原因**: `index.ts` 导入 layout → layout 导入 `virtual:app-config`，esbuild 无法解析
- **修复**: build 命令添加 `--external:virtual:* --external:deer-mobile --external:deer-mobile/*`

### 布局系统实现

布局通过 `RuntimePlugin` 的 `rootContainer` 钩子注入，而非硬编码到 `createRuntimeApp`：

1. [`createRuntimeApp`](packages/deer-mobile/src/runtime/create-app.ts) 使用 `pluginManager.composeRootContainer(() => h(RouterView))` 构建组件树
2. [`code-gen.ts`](packages/deer-mobile/plugins/setup-plugin/code-gen.ts) 在生成的 `virtual:setup-app` 中注册布局插件
3. 布局使用 `defineAsyncComponent(() => import('deer-mobile/layouts'))` 延迟加载，避免 build 时打包 `virtual:app-config`

### 文件监听与热更新

[`builtinPlugin`](packages/deer-mobile/plugins/builtin-plugin/index.ts) 新增 `this.addWatchFile(filePath)`，修改 `plugins/builtin-plugin/pages/*.tsx` 时自动触发 HMR。

### 已知待办

- [ ] 旧 BuildPlugin（config-plugin, scan-pages-plugin 等）迁移到新 BuildPlugin 架构
- [ ] Preset 机制实现（`presets/default.ts`）
- [ ] npm 包插件解析（`resolveNpmPlugin()`）
- [ ] 插件间通信方法（`registerMethod` / `callMethod`）
- [ ] 部署 deer-mobile 到 npm 前需要构建 `dist/` 目录
