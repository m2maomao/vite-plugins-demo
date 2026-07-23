/**
 * Deer Mobile — BuildAPIImpl
 *
 * BuildAPI 的实现类。
 * setup-plugin 内部使用，负责收集 BuildPlugin 的注册信息。
 */

import type {
  BuildAPI,
  BuildPlugin,
  Preset,
  AppConfig,
  RouteConfig,
  GenerateAPI,
  ScriptConfig,
  PluginDescriptor,
} from '../../src/build/types';
import type { RuntimePlugin } from '../../src/runtime/types';

// ============================================
// 收集到的信息
// ============================================

export interface CollectedState {
  descriptors: PluginDescriptor[];
  modifyConfigFns: Array<(config: AppConfig) => AppConfig | void>;
  modifyRoutesFns: Array<(routes: RouteConfig[]) => RouteConfig[] | void>;
  initFns: Array<() => void | Promise<void>>;
  generateFns: Array<(gen: GenerateAPI) => void | Promise<void>>;
  buildCompleteFns: Array<(info: { duration: number; routes: RouteConfig[] }) => void>;
  devCompileDoneFns: Array<(info: { duration: number; isFirstCompile: boolean }) => void>;
  runtimePlugins: RuntimePlugin[];
  entryCodes: Array<{ code: string; ahead: boolean }>;
  imports: string[];
  htmlScripts: ScriptConfig[];
  htmlHeadScripts: ScriptConfig[];
  middlewares: Array<(req: unknown, res: unknown, next: () => void) => void>;
  watcherPaths: string[];
  methods: Map<string, (...args: unknown[]) => unknown>;
  registeredPlugins: BuildPlugin[];
}

// ============================================
// GenerateAPIImpl
// ============================================

export class GenerateAPIImpl implements GenerateAPI {
  constructor(private state: CollectedState) {}

  addEntryCode(code: string, options?: { ahead?: boolean }): void {
    this.state.entryCodes.push({ code, ahead: options?.ahead ?? false });
  }

  addImport(specifier: string, source: string): void {
    this.state.imports.push(`import ${specifier} from '${source}'`);
  }

  getState() {
    return {
      config: {} as AppConfig,
      routes: [] as RouteConfig[],
      runtimePlugins: this.state.runtimePlugins,
    };
  }
}

// ============================================
// BuildAPIImpl
// ============================================

export class BuildAPIImpl implements BuildAPI {
  private currentDescriptor: PluginDescriptor | null = null;
  private _getConfig: () => AppConfig;
  private _getRoutes: () => RouteConfig[];

  constructor(
    private state: CollectedState,
    getConfig: () => AppConfig,
    getRoutes: () => RouteConfig[],
  ) {
    this._getConfig = getConfig;
    this._getRoutes = getRoutes;
  }

  // ========== 1. 插件描述 ==========

  describe(descriptor: PluginDescriptor): void {
    this.currentDescriptor = descriptor;
    this.state.descriptors.push(descriptor);
  }

  // ========== 2. 生命周期钩子 ==========

  onInit(fn: () => void | Promise<void>): void {
    this.state.initFns.push(fn);
  }

  modifyConfig(fn: (config: AppConfig) => AppConfig | void): void {
    this.state.modifyConfigFns.push(fn);
  }

  modifyRoutes(fn: (routes: RouteConfig[]) => RouteConfig[] | void): void {
    this.state.modifyRoutesFns.push(fn);
  }

  onGenerate(fn: (gen: GenerateAPI) => void | Promise<void>): void {
    this.state.generateFns.push(fn);
  }

  onBuildComplete(fn: (info: { duration: number; routes: RouteConfig[] }) => void): void {
    this.state.buildCompleteFns.push(fn);
  }

  onDevCompileDone(fn: (info: { duration: number; isFirstCompile: boolean }) => void): void {
    this.state.devCompileDoneFns.push(fn);
  }

  // ========== 3. Service API ==========

  addRuntimePlugin(plugin: RuntimePlugin): void {
    this.state.runtimePlugins.push(plugin);
  }

  addEntryCode(code: string, options?: { ahead?: boolean }): void {
    this.state.entryCodes.push({ code, ahead: options?.ahead ?? false });
  }

  addImport(specifier: string, source: string): void {
    this.state.imports.push(`import ${specifier} from '${source}'`);
  }

  addHTMLScript(script: ScriptConfig): void {
    this.state.htmlScripts.push(script);
  }

  addHTMLHeadScript(script: ScriptConfig): void {
    this.state.htmlHeadScripts.push(script);
  }

  addBeforeMiddlewares(middleware: (req: unknown, res: unknown, next: () => void) => void): void {
    this.state.middlewares.push(middleware);
  }

  addTmpGenerateWatcherPaths(paths: string[]): void {
    this.state.watcherPaths.push(...paths);
  }

  // ========== 4. 插件注册 ==========

  registerPlugin(plugin: BuildPlugin | Preset): void {
    if (Array.isArray(plugin)) {
      plugin.forEach((p) => this.state.registeredPlugins.push(p));
    } else if (typeof plugin === 'function') {
      this.state.registeredPlugins.push(plugin as BuildPlugin);
    }
  }

  // ========== 5. 插件间通信 ==========

  registerMethod(name: string, fn: (...args: unknown[]) => unknown): void {
    this.state.methods.set(name, fn);
  }

  callMethod(name: string, ...args: unknown[]): unknown {
    const fn = this.state.methods.get(name);
    if (fn) return fn(...args);
    console.warn(`[Deer] callMethod: "${name}" 未注册`);
    return undefined;
  }

  hasMethod(name: string): boolean {
    return this.state.methods.has(name);
  }

  // ========== 6. 工具 ==========

  getConfig(): AppConfig {
    return this._getConfig();
  }

  getRoutes(): RouteConfig[] {
    return this._getRoutes();
  }

  getRuntimePlugins(): RuntimePlugin[] {
    return this.state.runtimePlugins;
  }

  logger = {
    info: (msg: string) => console.log(`[Deer:BuildPlugin] ${msg}`),
    warn: (msg: string) => console.warn(`[Deer:BuildPlugin] ${msg}`),
    error: (msg: string) => console.error(`[Deer:BuildPlugin] ${msg}`),
  };
}
