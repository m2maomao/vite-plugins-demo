/**
 * Deer Mobile — PluginManager
 *
 * 运行时插件管理器。
 * 职责: 注册 RuntimePlugin、按 priority 排序、按生命周期执行钩子。
 * 提供 RuntimeContext 作为插件间通信和运行时 API 的载体。
 */

import type { App, Component, VNode } from 'vue';
import type { Router, RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import type { AppConfig } from '../build/types';
import type { RuntimePlugin, RuntimeContext } from './types';

// ============================================
// PluginManager
// ============================================

export class PluginManager {
  private plugins: RuntimePlugin[] = [];
  private context: RuntimeContext;

  constructor(config: AppConfig) {
    this.context = this.createContext(config);
  }

  // ============================================
  // 插件注册
  // ============================================

  /** 注册一个运行时插件（自动按 priority 排序） */
  use(plugin: RuntimePlugin): this {
    this.plugins.push(plugin);
    this.plugins.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
    return this;
  }

  /** 批量注册插件 */
  useMany(plugins: RuntimePlugin[]): this {
    plugins.forEach((p) => this.use(p));
    return this;
  }

  // ============================================
  // 生命周期执行
  // ============================================

  /** 执行指定生命周期的所有钩子 */
  async callHook(hook: string, ...args: unknown[]): Promise<void> {
    for (const plugin of this.plugins) {
      const fn = (plugin as unknown as Record<string, unknown>)[hook] as
        ((...args: unknown[]) => void | Promise<void>) | undefined;
      if (fn) {
        try {
          await fn(...args, this.context);
        } catch (err) {
          console.error(`[Deer:Plugin] "${plugin.name}" hook "${hook}" 执行失败:`, err);
        }
      }
    }
  }

  // ============================================
  // Provider 嵌套处理
  // ============================================

  /**
   * 执行 rootContainer 链——构建 Provider 嵌套结构
   *
   * 执行顺序（从外到内）:
   *   outerProvider → rootContainer → innerProvider
   *
   * 例如:
   *   outer:  SentryProvider
   *   root:   AnalyticsProvider
   *   inner:  ThemeProvider
   *   → <SentryProvider><AnalyticsProvider><ThemeProvider><App /></ThemeProvider></AnalyticsProvider></SentryProvider>
   */
  composeRootContainer(renderApp: () => VNode): () => VNode {
    let container = renderApp;

    // 1. innerProvider（最内层，最先应用）
    for (const plugin of this.plugins) {
      if (plugin.innerProvider) {
        const wrap = plugin.innerProvider;
        const prev = container;
        container = () => wrap(prev);
      }
    }

    // 2. rootContainer
    for (const plugin of this.plugins) {
      if (plugin.rootContainer) {
        const wrap = plugin.rootContainer;
        const prev = container;
        container = () => {
          const result = wrap(prev, this.context);
          return typeof result === 'function' ? (result as () => VNode)() : result;
        };
      }
    }

    // 3. outerProvider（最外层，最后应用）
    for (const plugin of this.plugins) {
      if (plugin.outerProvider) {
        const wrap = plugin.outerProvider;
        const prev = container;
        container = () => wrap(prev);
      }
    }

    return container;
  }

  // ============================================
  // Context 管理
  // ============================================

  /** 获取运行时上下文 */
  getContext(): RuntimeContext {
    return this.context;
  }

  /** 设置 App 实例 */
  setApp(app: App): void {
    this.context.app = app;
  }

  /** 设置 Router 实例 */
  setRouter(router: Router): void {
    this.context.router = router;
  }

  /** 获取已注册的所有插件 */
  getPlugins(): RuntimePlugin[] {
    return [...this.plugins];
  }

  // ============================================
  // 私有方法
  // ============================================

  private createContext(config: AppConfig): RuntimeContext {
    return {
      app: null as unknown as App,
      router: null as unknown as Router,
      config,
      data: new Map(),

      // 这些方法会在 setApp/setRouter 后被实际功能替换
      addRouterGuard: () => {
        console.warn('[Deer] addRouterGuard: router 未就绪');
      },
      addRoute: () => {
        console.warn('[Deer] addRoute: router 未就绪');
      },
      removeRoute: () => {
        console.warn('[Deer] removeRoute: router 未就绪');
      },
      getRoutes: () => [],
      addLayout: () => {
        console.warn('[Deer] addLayout: app 未就绪');
      },
      setLayout: () => {
        console.warn('[Deer] setLayout: app 未就绪');
      },
    };
  }
}
