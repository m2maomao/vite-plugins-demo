/**
 * Deer Mobile — Runtime Plugin System
 *
 * 运行时插件系统导出入口。
 */

export type { RuntimePlugin, RuntimeContext } from './types';
export { PluginManager } from './plugin-manager';
export { createRuntimeApp } from './create-app';
export type { CreateRuntimeAppOptions } from './create-app';
