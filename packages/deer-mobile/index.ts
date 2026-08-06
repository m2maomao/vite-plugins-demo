// ============================================
// Deer Mobile — 入口导出
// ============================================

// ---- Vite 插件 ----
export { default as scanPagesPlugin } from './plugins/scan-pages-plugin';
export { default as apiPlugin } from './plugins/api-plugin';
export { default as builtinPlugin } from './plugins/builtin-plugin';
export { default as mockPlugin } from './plugins/mock-plugin';

// ---- PWA 插件 ----
export { default as pwa } from './plugins/pwa-plugin';

// ---- 框架入口（v5）----
export { default as deer } from './plugins/setup-plugin';

// ---- 运行时插件（v5 RuntimePlugin）----
export { default as piniaRuntimePlugin } from './plugins/runtime/pinia-plugin';
export { default as i18nRuntimePlugin } from './plugins/runtime/i18n-plugin';
export { default as authRuntimePlugin } from './plugins/runtime/auth-plugin';
export { default as apiRuntimePlugin } from './plugins/runtime/api-plugin';
export { default as themeRuntimePlugin } from './plugins/runtime/theme-plugin';
export { default as createLoadingPlugin } from './plugins/runtime/loading-plugin';
export { default as createVConsolePlugin, vconsoleRuntimePlugin } from './plugins/runtime/vconsole-plugin';

// ---- 类型导出 ----
export type { MockPluginOptions, MockApis } from './plugins/mock-plugin';
export type {
  BuildPlugin,
  BuildAPI,
  Preset,
  AppConfig,
  VConsoleConfig,
  PluginDescriptor,
  ScriptConfig,
  RouteConfig,
  GenerateAPI,
} from './src/build/types';
export type { RuntimePlugin, RuntimeContext } from './src/runtime/types';
export type { CreateRuntimeAppOptions } from './src/runtime/create-app';

export { PluginManager } from './src/runtime/plugin-manager';
export { createRuntimeApp } from './src/runtime/create-app';

// ---- IM Feature（可选：需安装 @im/sdk + web 传输插件；未使用则 tree-shaking 剔除）----
export { default as createIMPlugin } from './features/im/plugin';
export { useIM } from './features/im/composables';
export { initIM, destroyIM, reconnectIM, setIMHandlers } from './features/im/state';
export { default as ImChat } from './features/im/components/ImChat';
export { default as ImChatList } from './features/im/components/ImChatList';
export { default as MessageBubble } from './features/im/components/MessageBubble';
export type { DeerIMConfig, DeerIMPluginOptions, SendChatInfo, IMComMessage, IMComChat } from './features/im/types';

// ---- OCR Feature（可选：身份证识别；未使用则 tree-shaking 剔除）----
export { default as OcrCard } from './features/ocr/components/OcrCard';
export { useIdCardOcr } from './features/ocr/composables';
export type { IdCardInfo, IdCardOcrOptions, UseIdCardOcrReturn } from './features/ocr/types';

// ---- Chart Feature（可选：echarts 图表；未使用则 tree-shaking 剔除）----
export { default as ChartCpt } from './features/chart/components/ChartCpt';
export { useChart } from './features/chart/composables';
export type { ChartType, ChartData, ChartSeries, ChartCptProps } from './features/chart/types';
