/**
 * Deer Mobile — Runtime Plugin System Types
 *
 * 运行时插件系统类型定义。
 * RuntimePlugin 是运行在浏览器端的插件，形式为带生命周期钩子的对象。
 * 由 BuildPlugin 在构建时通过 addRuntimePlugin() 注册。
 *
 * 参考: Umi 4 Runtime Plugin 系统
 */

import type { App, Component, VNode } from 'vue';
import type { Router, RouteLocationNormalized, RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import type { AppConfig } from '../build/types';

// ============================================
// RuntimePlugin — 运行时插件
// ============================================

export interface RuntimePlugin {
  /** 插件名称 */
  name: string;

  /** 优先级（数字越小越先执行），默认 10 */
  priority?: number;

  // ===== 应用生命周期 =====

  /** App 创建后调用（此时 router 未创建） */
  onAppCreated?: (app: App, ctx: RuntimeContext) => void | Promise<void>;

  /** Router 创建后调用（可在此注册 beforeEach 守卫） */
  onRouterCreated?: (router: Router, ctx: RuntimeContext) => void | Promise<void>;

  /** Router isReady() 完成后调用 */
  onRouterReady?: (router: Router, ctx: RuntimeContext) => void | Promise<void>;

  /** app.mount() 前调用 */
  onBeforeMount?: (app: App, ctx: RuntimeContext) => void | Promise<void>;

  /** app.mount() 完成后调用 */
  onMounted?: (ctx: RuntimeContext) => void | Promise<void>;

  // ===== Provider 机制（对标 Umi rootContainer） =====

  /** 包裹根组件（用于 ThemeProvider / StoreProvider 等） */
  rootContainer?: (container: () => VNode, ctx: RuntimeContext) => VNode | (() => VNode);

  /** 内层 Provider（在 rootContainer 内部） */
  innerProvider?: (container: () => VNode) => VNode;

  /** 外层 Provider（在 rootContainer 外部） */
  outerProvider?: (container: () => VNode) => VNode;

  // ===== 页面生命周期 =====

  /** 进入页面时调用 */
  onPageEnter?: (route: RouteLocationNormalized, ctx: RuntimeContext) => void | Promise<void>;

  /** 离开页面时调用 */
  onPageLeave?: (route: RouteLocationNormalized, ctx: RuntimeContext) => void | Promise<void>;

  /** 路由变更时调用 */
  onRouteChange?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    ctx: RuntimeContext,
  ) => void | Promise<void>;

  // ===== 运行时路由（对标 Umi patchRoutes） =====

  /** 运行时修改路由表（基于用户权限/状态动态调整） */
  patchRoutes?: (info: { routes: RouteRecordRaw[]; initialState?: Record<string, unknown> }) => RouteRecordRaw[] | void;

  /** 路由历史变更 */
  onHistoryChange?: (info: { location: Location; action: 'PUSH' | 'POP' | 'REPLACE' }) => void;

  // ===== 错误处理 =====

  /** 全局错误捕获 */
  onError?: (error: Error, ctx: RuntimeContext) => void;
}

// ============================================
// RuntimeContext — 运行时上下文
// ============================================

export interface RuntimeContext {
  /** Vue App 实例 */
  app: App;
  /** Vue Router 实例 */
  router: Router;
  /** 应用配置 */
  config: AppConfig;
  /** 插件共享数据空间（插件间通信用） */
  data: Map<string, unknown>;

  // ===== 运行时 API =====

  /** 动态添加路由守卫 */
  addRouterGuard(type: 'beforeEach' | 'afterEach', guard: (...args: unknown[]) => unknown): void;

  /** 动态添加路由 */
  addRoute(route: RouteRecordRaw): void;

  /** 动态移除路由 */
  removeRoute(name: string): void;

  /** 获取当前路由表 */
  getRoutes(): RouteRecordNormalized[];

  /** 注册布局组件 */
  addLayout(name: string, component: Component): void;

  /** 切换到指定布局 */
  setLayout(name: string): void;
}
