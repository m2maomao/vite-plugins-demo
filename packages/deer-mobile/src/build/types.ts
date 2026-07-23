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
// AppConfig — 应用配置
// ============================================

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
