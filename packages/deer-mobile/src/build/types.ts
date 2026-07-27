/**
 * Deer Mobile — Build Plugin System Types
 *
 * 构建时插件系统类型定义。
 * BuildPlugin 是运行在 Node.js 端的插件，形式为 Function(BuildAPI)。
 * 可以发布为 npm 包供团队共享。
 *
 * 参考: Umi 4 IApi 插件系统
 */

// ============================================
// Preset
// ============================================

/** Preset = BuildPlugin 的集合，用于分发一组相关插件 */
export type Preset = BuildPlugin[] | ((api: BuildAPI) => void);

// ============================================
// BuildPlugin
// ============================================

/** 构建时插件：函数形式，接收 BuildAPI */
export type BuildPlugin = (api: BuildAPI) => void | Promise<void>;

// ============================================
// PluginDescriptor
// ============================================

export interface PluginDescriptor {
  /** 插件唯一标识 */
  id: string;
  /** 在 AppConfig 中的配置 key（如 'sentry'） */
  key?: string;
  /** 是否默认启用 */
  enable?: boolean;
  /** 配置 Schema 校验规则 */
  configSchema?: Record<string, unknown>;
  /** 依赖的其他插件 id 列表 */
  dependencies?: string[];
}

// ============================================
// ScriptConfig
// ============================================

export interface ScriptConfig {
  src?: string;
  content?: string;
  attrs?: Record<string, string>;
  async?: boolean;
  defer?: boolean;
}

// ============================================
// RouteConfig
// ============================================

export interface RouteConfig {
  path: string;
  file?: string;
  redirect?: string;
  meta?: Record<string, unknown>;
  type?: string;
}

// ============================================
// PWAOptions — PWA 配置选项（vite-plugin-pwa 封装）
// ============================================

/**
 * PWA 配置选项。
 *
 * 用于 pwa() Vite 插件，封装 vite-plugin-pwa。
 * 提供 deer-mobile 默认配置 + 开箱即用的离线支持。
 *
 * @example
 * ```ts
 * pwa({ enabled: true, manifest: { name: 'My App' } })
 * ```
 */
export interface PWAOptions {
  /** 是否启用 PWA（默认 false） */
  enabled?: boolean;

  /** 是否自动注册 Service Worker（默认 true：autoUpdate 模式） */
  registerSW?: boolean;

  /** Web App Manifest 配置 */
  manifest?: {
    name?: string;
    short_name?: string;
    description?: string;
    start_url?: string;
    /** 显示模式（默认 'standalone'） */
    display?: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
    /** 屏幕方向 */
    orientation?: 'portrait' | 'landscape';
    /** 主题色（默认使用主题色） */
    theme_color?: string;
    /** 背景色（默认 '#ffffff'） */
    background_color?: string;
    /** 应用图标 */
    icons?: Array<{ src: string; sizes: string; type: string }>;
  };

  /** 预缓存文件匹配模式（默认 ['**\/*.{js,css,html,svg,png,ico}']） */
  globPatterns?: string[];

  /** 运行时缓存策略 */
  runtimeCaching?: Array<{
    /** URL 匹配模式 */
    urlPattern: string | RegExp;
    /** 缓存策略 */
    handler: 'NetworkFirst' | 'CacheFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';
    /** 缓存选项 */
    options?: {
      /** 缓存名称 */
      cacheName?: string;
      /** 过期配置 */
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
    };
  }>;
}

// ============================================
// AppConfig — 应用配置
// ============================================

/** 环境变量声明：Key = 运行时字段名, Value = 环境变量名 */
export type EnvDefinitions = Record<string, string>;

export interface AppConfig {
  title: string;
  description: string;
  author: string;
  base: string;
  theme: {
    primaryColor: string;
    darkMode: boolean;
  };
  layout: 'side' | 'top' | 'mix';
  noNavPages: string[];
  request: {
    baseURL: string;
  };
  sm4Key?: string;
  i18n?: {
    locale: string;
    fallbackLocale?: string;
    messages?: Record<string, Record<string, Record<string, string>>>;
  };
  mock?: {
    enabled?: boolean;
    dir?: string;
  };
  /** 全局路由加载动画配置 */
  loading?: {
    /** 是否启用加载动画（默认 true） */
    enabled?: boolean;
    /** 加载条颜色（默认使用主题色） */
    color?: string;
    /** 加载条高度（默认 3px） */
    height?: string;
    /** 加载位置：'top' | 'fullscreen'（默认 'top'） */
    mode?: 'top' | 'fullscreen';
    /** 自定义加载组件（Vue 组件对象） */
    component?: unknown;
  };
  /** 运行时环境变量（由 deer() env 选项声明，构建时自动注入） */
  env: Record<string, string>;
  /** 插件配置动态扩展 */
  [key: string]: unknown;
}

// ============================================
// GenerateAPI
// ============================================

export interface GenerateAPI {
  /** 注入代码到生成的 runtime entry */
  addEntryCode(code: string, options?: { ahead?: boolean }): void;
  /** 添加 import 语句 */
  addImport(specifier: string, source: string): void;
  /** 获取当前所有收集的信息 */
  getState(): {
    config: AppConfig;
    routes: RouteConfig[];
    runtimePlugins: unknown[];
  };
}

// ============================================
// BuildAPI — 构建时插件可用的全部 API
// ============================================

export interface BuildAPI {
  // ========== 1. 插件描述 ==========

  /** 描述插件：声明 id、配置 key、Schema */
  describe(descriptor: PluginDescriptor): void;

  // ========== 2. 生命周期钩子 ==========

  /** 插件初始化 */
  onInit(fn: () => void | Promise<void>): void;

  /** 修改 AppConfig */
  modifyConfig(fn: (config: AppConfig) => AppConfig | void): void;

  /** 修改路由表 */
  modifyRoutes(fn: (routes: RouteConfig[]) => RouteConfig[] | void): void;

  /** 代码生成前回调 */
  onGenerate(fn: (gen: GenerateAPI) => void | Promise<void>): void;

  /** 构建完成回调（成功后调用） */
  onBuildComplete(fn: (info: { duration: number; routes: RouteConfig[] }) => void): void;

  /** 开发环境编译完成回调 */
  onDevCompileDone(fn: (info: { duration: number; isFirstCompile: boolean }) => void): void;

  // ========== 3. Service API ==========

  /** 注册运行时插件 */
  addRuntimePlugin(plugin: unknown): void;

  /** 注入代码到 runtime entry */
  addEntryCode(code: string, options?: { ahead?: boolean }): void;

  /** 注入 import 语句 */
  addImport(specifier: string, source: string): void;

  /** 向 HTML 注入 script */
  addHTMLScript(script: ScriptConfig): void;

  /** 向 HTML <head> 注入 script */
  addHTMLHeadScript(script: ScriptConfig): void;

  /** 添加 Vite Dev Server 中间件 */
  addBeforeMiddlewares(middleware: (req: unknown, res: unknown, next: () => void) => void): void;

  /** 添加模板生成监听路径（用于开发时热更新） */
  addTmpGenerateWatcherPaths(paths: string[]): void;

  // ========== 4. 插件注册（在 Preset 函数中使用） ==========

  /** 在插件内部注册另一个插件 */
  registerPlugin(plugin: BuildPlugin | Preset): void;

  // ========== 5. 插件间通信 ==========

  /** 注册一个方法供其他插件调用 */
  registerMethod(name: string, fn: (...args: unknown[]) => unknown): void;

  /** 调用其他插件注册的方法 */
  callMethod(name: string, ...args: unknown[]): unknown;

  /** 判断方法是否存在 */
  hasMethod(name: string): boolean;

  // ========== 6. 工具 ==========

  /** 获取当前 AppConfig */
  getConfig(): AppConfig;

  /** 获取当前路由表 */
  getRoutes(): RouteConfig[];

  /** 获取已注册的所有 RuntimePlugin */
  getRuntimePlugins(): unknown[];

  /** 日志 */
  logger: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };
}
