/**
 * Deer Mobile — Setup Plugin Types
 *
 * deer() Vite 插件的配置选项类型定义。
 */

import type { BuildPlugin, AppConfig, EnvDefinitions, RouteConfig, GenerateAPI } from '../../src/build/types';
import type { RuntimePlugin } from '../../src/runtime/types';
import type { MockPluginOptions } from '../mock-plugin';

// ============================================
// DeerOptions — deer() 入口配置
// ============================================

export interface DeerOptions {
  /** 应用配置（框架配置 + 插件配置） */
  config?: Partial<AppConfig>;

  /** 环境变量声明
   *
   *  声明需要暴露到运行时的环境变量。
   *  Key = 运行时字段名, Value = 环境变量名（如 'VITE_API_URL'）。
   *
   *  @example
   *  env: {
   *    apiBaseUrl: 'VITE_API_BASE_URL',
   *    appVersion: 'VITE_APP_VERSION',
   *  }
   *
   *  运行时通过 appConfig.env.apiBaseUrl 访问。
   */
  env?: EnvDefinitions;

  /** 是否自动暴露所有 VITE_ 前缀变量到运行时（默认 true） */
  envFallback?: boolean;

  /** 路由配置 */
  routes?: {
    /** 插件注入的路由（如内置 login/404 页面） */
    pluginRoutes?: RouteConfig[];
  };

  /** Mock 配置 */
  mock?: MockPluginOptions;

  /** ================================
   *  插件系统
   *  ================================ */

  /** Preset 列表（一组 BuildPlugin 的集合） */
  presets?: BuildPlugin[] | ((api: any) => void)[];

  /** 构建时插件列表（Function(BuildAPI) 形式） */
  buildPlugins?: BuildPlugin[];

  /** 运行时插件列表（RuntimePlugin 对象或模块路径） */
  runtimePlugins?: RuntimePlugin[];

  /** ================================
   *  构建时配置回调（语法糖，内部转为匿名 BuildPlugin）
   *  ================================ */

  /** 在代码生成前修改路由表 */
  modifyRoutes?: (routes: RouteConfig[]) => RouteConfig[] | void;

  /** 在代码生成前修改 AppConfig */
  modifyConfig?: (config: AppConfig) => AppConfig | void;

  /** 代码生成前的最终调整 */
  onGenerate?: (api: GenerateAPI) => void | Promise<void>;
}
