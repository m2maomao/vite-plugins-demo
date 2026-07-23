/**
 * Deer Mobile — Setup Plugin (deer)
 *
 * 这是 Deer 框架唯一的 Vite 插件入口。
 * 负责：
 *   1. 接受 DeerOptions（配置、插件、回调等）
 *   2. 执行 BuildPlugin 生命周期
 *   3. 生成 virtual:app-config（暴露配置给运行时）
 *   4. 生成 virtual:setup-app（运行时启动代码）
 *   5. 自动注入到 main.ts
 */

import type { Plugin, ViteDevServer } from 'vite';
import { BuildAPIImpl, GenerateAPIImpl, type CollectedState } from './build-api';
import { generateSetupAppCode } from './code-gen';
import type { DeerOptions } from './types';
import type { BuildPlugin, AppConfig, RouteConfig } from '../../src/build/types';
import type { RuntimePlugin } from '../../src/runtime/types';

// ============================================
// 虚拟模块标识符
// ============================================

const VIRTUAL_SETUP_APP = 'virtual:setup-app';
const RESOLVED_SETUP_APP = '\0' + VIRTUAL_SETUP_APP;
const VIRTUAL_APP_CONFIG = 'virtual:app-config';
const RESOLVED_APP_CONFIG = '\0' + VIRTUAL_APP_CONFIG;

// ============================================
// 默认配置
// ============================================

const DEFAULT_CONFIG: AppConfig = {
  title: 'My App',
  description: 'A Vite-powered app',
  author: 'deer',
  base: '/',
  theme: {
    primaryColor: '#1890ff',
    darkMode: false,
  },
  layout: 'side',
  noNavPages: ['/login', '/404'],
  request: {
    baseURL: '/api',
  },
};

// ============================================
// deer() — 框架 Vite 插件入口
// ============================================

export default function deer(options: DeerOptions = {}): Plugin {
  console.log('[Deer] deer() function CALLED');
  // ---- 收集状态 ----
  const state: CollectedState = {
    descriptors: [],
    modifyConfigFns: [],
    modifyRoutesFns: [],
    initFns: [],
    generateFns: [],
    buildCompleteFns: [],
    devCompileDoneFns: [],
    runtimePlugins: [...(options.runtimePlugins ?? [])],
    entryCodes: [],
    imports: [],
    htmlScripts: [],
    htmlHeadScripts: [],
    middlewares: [],
    watcherPaths: [],
    methods: new Map(),
    registeredPlugins: [],
  };

  // ---- 合并配置 ----
  let appConfig: AppConfig = {
    ...DEFAULT_CONFIG,
    ...options.config,
    theme: { ...DEFAULT_CONFIG.theme, ...options.config?.theme },
    request: { ...DEFAULT_CONFIG.request, ...options.config?.request },
  };

  const routes: RouteConfig[] = [];

  // ---- 构建 API 实例 ----
  const buildAPI = new BuildAPIImpl(
    state,
    () => appConfig,
    () => routes,
  );

  // ---- 执行 onInit（先收集所有注册）----
  const allBuildPlugins = collectBuildPlugins(options, buildAPI);
  allBuildPlugins.forEach((plugin) => {
    try {
      plugin(buildAPI);
    } catch (err) {
      console.error(`[Deer] BuildPlugin 初始化失败:`, err);
    }
  });

  return {
    name: 'deer:setup',

    // ==========================================
    // config — 修改 Vite 配置
    // ==========================================
    config(viteConfig) {
      for (const fn of state.modifyConfigFns) {
        const result = fn(appConfig);
        if (result) appConfig = result;
      }

      return {
        base: appConfig.base,
        esbuild: {
          ...(viteConfig.esbuild as Record<string, unknown>),
        },
      };
    },

    // ==========================================
    // resolveId — 处理虚拟模块
    // ==========================================
    resolveId(id) {
      if (id === VIRTUAL_SETUP_APP) return RESOLVED_SETUP_APP;
      if (id === VIRTUAL_APP_CONFIG) return RESOLVED_APP_CONFIG;
      return null;
    },

    // ==========================================
    // load — 生成虚拟模块内容
    // ==========================================
    load(id) {
      if (id === RESOLVED_APP_CONFIG) {
        return `export const appConfig = ${JSON.stringify(appConfig)};`;
      }

      if (id === RESOLVED_SETUP_APP) {
        const code = generateSetupAppCode(state, {
          appConfigPath: VIRTUAL_APP_CONFIG,
          routesPath: 'virtual:routes',
        });
        console.log(`[Deer] virtual:setup-app generated (${code.length} chars)`);
        return code;
      }

      return null;
    },

    // ==========================================
    // transform — 自动注入到 main.ts
    // ==========================================
    transform(code, id) {
      // 调试: 打印被 transform 的文件
      if (id.includes('main')) {
        console.log('[Deer:Debug] transform called for:', id.substring(id.length - 40));
        console.log('[Deer:Debug] code preview:', code.substring(0, 100));
      }
      if (id.includes('src/main.ts') || id.includes('src/main.tsx')) {
        if (!code.includes(VIRTUAL_SETUP_APP)) {
          console.log('[Deer:Debug] injecting virtual:setup-app into main.ts');
          return {
            code: `import '${VIRTUAL_SETUP_APP}';\n${code}`,
            map: null,
          };
        }
      }
      return null;
    },

    // ==========================================
    // configureServer — Dev Server 中间件
    // ==========================================
    configureServer(server: ViteDevServer) {
      state.middlewares.forEach((mw) => {
        server.middlewares.use(mw);
      });

      if (state.watcherPaths.length > 0) {
        state.watcherPaths.forEach((watchPath) => {
          server.watcher.add(watchPath);
        });
      }
    },

    // ==========================================
    // buildStart — 初始化阶段
    // ==========================================
    async buildStart() {
      for (const fn of state.initFns) {
        await fn();
      }
    },

    // ==========================================
    // buildEnd — 构建完成
    // ==========================================
    buildEnd() {
      const duration = 0;
      for (const fn of state.buildCompleteFns) {
        fn({ duration, routes });
      }
    },

    // ==========================================
    // handleHotUpdate — 开发编译完成
    // ==========================================
    async handleHotUpdate() {
      for (const fn of state.devCompileDoneFns) {
        fn({ duration: 0, isFirstCompile: false });
      }
    },

    // ==========================================
    // transformIndexHtml — 注入 HTML 脚本
    // ==========================================
    transformIndexHtml() {
      const tags: import('vite').HtmlTagDescriptor[] = [];

      state.htmlHeadScripts.forEach((script) => {
        tags.push({
          tag: 'script',
          injectTo: 'head' as const,
          attrs: {
            ...(script.src ? { src: script.src } : {}),
            ...script.attrs,
            ...(script.async ? { async: '' } : {}),
            ...(script.defer ? { defer: '' } : {}),
          },
          ...(script.content ? { children: script.content } : {}),
        });
      });

      state.htmlScripts.forEach((script) => {
        tags.push({
          tag: 'script',
          injectTo: 'body' as const,
          attrs: {
            ...(script.src ? { src: script.src } : {}),
            ...script.attrs,
            ...(script.async ? { async: '' } : {}),
            ...(script.defer ? { defer: '' } : {}),
          },
          ...(script.content ? { children: script.content } : {}),
        });
      });

      return tags;
    },
  };
}

// ============================================
// 收集所有 BuildPlugin
// ============================================

function collectBuildPlugins(options: DeerOptions, api: BuildAPIImpl): BuildPlugin[] {
  const plugins: BuildPlugin[] = [];

  // 1. 将 modifyRoutes/modifyConfig/onGenerate 转为匿名 BuildPlugin
  if (options.modifyRoutes || options.modifyConfig || options.onGenerate) {
    const anonymousPlugin: BuildPlugin = (buildApi) => {
      if (options.modifyRoutes) {
        buildApi.modifyRoutes(options.modifyRoutes);
      }
      if (options.modifyConfig) {
        buildApi.modifyConfig(options.modifyConfig);
      }
      if (options.onGenerate) {
        buildApi.onGenerate(options.onGenerate);
      }
    };
    plugins.push(anonymousPlugin);
  }

  // 2. 展开 presets
  if (options.presets) {
    for (const preset of options.presets) {
      if (Array.isArray(preset)) {
        plugins.push(...preset);
      } else if (typeof preset === 'function') {
        plugins.push(preset as BuildPlugin);
      }
    }
  }

  // 3. 用户直接指定的 BuildPlugin
  if (options.buildPlugins) {
    plugins.push(...options.buildPlugins);
  }

  return plugins;
}
