// ============================================
// Deer Mobile — 入口导出
// ============================================

// ---- Vite 插件 ----
export { default as scanPagesPlugin } from './plugins/scan-pages-plugin';
export { default as apiPlugin } from './plugins/api-plugin';
export { default as builtinPlugin } from './plugins/builtin-plugin';
export { default as mockPlugin } from './plugins/mock-plugin';

// ---- 框架入口（v5）----
export { default as deer } from './plugins/setup-plugin';

// ---- 运行时插件（v5 RuntimePlugin）----
export { default as piniaRuntimePlugin } from './plugins/runtime/pinia-plugin';
export { default as i18nRuntimePlugin } from './plugins/runtime/i18n-plugin';
export { default as authRuntimePlugin } from './plugins/runtime/auth-plugin';
export { default as apiRuntimePlugin } from './plugins/runtime/api-plugin';

// ---- 类型导出 ----
export type { MockPluginOptions, MockApis } from './plugins/mock-plugin';
export type {
  BuildPlugin,
  BuildAPI,
  Preset,
  AppConfig,
  PluginDescriptor,
  ScriptConfig,
  RouteConfig,
  GenerateAPI,
} from './src/build/types';
export type { RuntimePlugin, RuntimeContext } from './src/runtime/types';
export type { CreateRuntimeAppOptions } from './src/runtime/create-app';

export { PluginManager } from './src/runtime/plugin-manager';
export { createRuntimeApp } from './src/runtime/create-app';
