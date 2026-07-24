/**
 * Deer Mobile — Code Generator
 *
 * 生成 virtual:setup-app 的代码。
 */

import type { CollectedState } from './build-api';
import type { RuntimePlugin } from '../../src/runtime/types';

const BUILTIN_PLUGIN_PATHS: Record<string, string> = {
  deer_piniaPlugin: 'deer-mobile/runtime/pinia',
  deer_i18nPlugin: 'deer-mobile/runtime/i18n',
  deer_authPlugin: 'deer-mobile/runtime/auth',
  deer_apiPlugin: 'deer-mobile/runtime/api',
};

interface PluginImportInfo {
  variable: string;
  importStmt: string;
  inlineCode: string;
}

/** 生成 layout 插件内联代码（必须在使用前注册） */
function generateLayoutPluginCode(): string {
  return [
    "import { h } from 'vue';",
    "import __deer_layoutComponent__ from 'deer-mobile/layouts';",
    'const __deer_layoutPlugin__ = {',
    "  name: 'deer:layout',",
    '  priority: 0,',
    '  rootContainer() {',
    '    return () => h(__deer_layoutComponent__);',
    '  },',
    '};',
  ].join('\n');
}

export function generateSetupAppCode(
  state: CollectedState,
  options: { appConfigPath: string; routesPath: string },
): string {
  const { appConfigPath = 'virtual:app-config', routesPath = 'virtual:routes' } = options;

  const pluginImports = collectPluginImports(state.runtimePlugins);

  const importStmts = pluginImports
    .map((i) => i.importStmt)
    .filter(Boolean)
    .join('\n');
  const inlineCodes = pluginImports
    .map((i) => i.inlineCode)
    .filter(Boolean)
    .join('\n\n');

  const pluginRegistrations = state.runtimePlugins
    .map((_p, i) => `  pluginManager.use(${pluginImports[i]?.variable || `__plugin_${i}__`});`)
    .join('\n');

  const sortedCodes = [...state.entryCodes].sort((a, b) => {
    if (a.ahead && !b.ahead) return -1;
    if (!a.ahead && b.ahead) return 1;
    return 0;
  });
  const entryCodesStr = sortedCodes.map((c) => c.code).join('\n');

  const code = [
    '// ============================================',
    '// Deer Mobile — Auto-generated App Entry',
    '// ============================================',
    "import { PluginManager, createRuntimeApp } from 'deer-mobile/runtime';",
    `import { appConfig } from '${appConfigPath}';`,
    `import { routes as staticRoutes } from '${routesPath}';`,
    importStmts,
    '',
    '// ---- 框架内置插件 ----',
    generateLayoutPluginCode(),
    '',
    '// ---- 用户自定义插件 ----',
    inlineCodes,
    '',
    '// ---- 初始化 PluginManager ----',
    'const pluginManager = new PluginManager(appConfig);',
    '',
    '// ---- 注册运行时插件 ----',
    'pluginManager.use(__deer_layoutPlugin__);',
    pluginRegistrations,
    '',
    '// ---- 入口注入代码 ----',
    entryCodesStr,
    '',
    '// ---- 启动 ----',
    'async function startApp() {',
    '  // 1. 立即启动应用（使用静态路由），不再等待远程路由',
    '  const runtimeApp = createRuntimeApp({',
    '    pluginManager,',
    '    routes: staticRoutes,',
    '    appConfig,',
    '  }).catch(err => console.error("[Deer] Runtime Error:", err));',
    '',
    '  // 2. 并行获取远程路由（不阻塞应用启动）',
    '  fetch("/api/routes")',
    '    .then(res => {',
    "      if (!res.ok) throw new Error('HTTP ' + res.status);",
    '      return res.json();',
    '    })',
    '    .then(result => {',
    '      const serverRoutes = result.data || [];',
    '      if (serverRoutes.length > 0 && pluginManager.getContext().router) {',
    '        const router = pluginManager.getContext().router;',
    '        serverRoutes.forEach(r => {',
    '          if (r.redirect) {',
    '            router.addRoute({ path: r.path, redirect: r.redirect });',
    '          }',
    '        });',
    "        console.log('🌐 已加载 ' + serverRoutes.length + ' 个远程路由');",
    '      }',
    '    })',
    "    .catch(e => console.warn('⚠️ 远程路由加载失败:', e));",
    '',
    '  await runtimeApp;',
    '}',
    '',
    'startApp();',
  ].join('\n');

  return code;
}

function collectPluginImports(plugins: RuntimePlugin[]): PluginImportInfo[] {
  return plugins.map((plugin, index) => {
    const name = plugin.name || `plugin_${index}`;
    const variable = name.replace(/[-:]/g, '_').replace(/[^a-zA-Z0-9_]/g, '') + 'Plugin';

    const builtinPath = BUILTIN_PLUGIN_PATHS[variable];
    if (builtinPath) {
      return {
        variable,
        importStmt: `import { default as ${variable} } from '${builtinPath}';`,
        inlineCode: '',
      };
    }

    return {
      variable,
      importStmt: '',
      inlineCode: generateInlinePluginCode(plugin, variable),
    };
  });
}

function generateInlinePluginCode(plugin: RuntimePlugin, varName: string): string {
  const hooks: string[] = [];

  const hookNames = [
    'onAppCreated',
    'onRouterCreated',
    'onRouterReady',
    'onBeforeMount',
    'onMounted',
    'rootContainer',
    'innerProvider',
    'outerProvider',
    'onPageEnter',
    'onPageLeave',
    'onRouteChange',
    'patchRoutes',
    'onHistoryChange',
    'onError',
  ] as const;

  for (const hook of hookNames) {
    const fn = plugin[hook];
    if (fn) {
      hooks.push(`  ${hook}: ${fn.toString()},`);
    }
  }

  return [
    `const ${varName} = {`,
    `  name: '${plugin.name}',`,
    `  priority: ${plugin.priority ?? 10},`,
    ...hooks,
    '};',
  ].join('\n');
}
