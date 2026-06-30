// 插件（vite.config。ts 中使用）
export { default as configPlugin } from './plugins/config-plugin';
export { default as setupPlugin } from './plugins/setup-plugin';
export { default as scanPagesPlugin } from './plugins/scan-pages-plugin';
export { default as apiPlugin } from './plugins/api-plugin';
export { default as builtinPlugin } from './plugins/builtin-plugin';
export { default as authPlugin } from './plugins/auth-plugin';
export type { FrameworkPlugin } from './plugins/config-plugin';

// 运行时（组件中使用）
export { http } from './src/utils/request';
export { useApi } from './src/composables/useApi';