import type { Plugin } from 'vite';
import fg from 'fast-glob';
import fs from 'fs';

const VIRTUAL_MODULE_ID = 'virtual:routes';
const RESOLVED_ID = `\0` + VIRTUAL_MODULE_ID;

// 路由配置类型
interface RouteConfig {
  path: string;
  file?: string;
  redirect?: string;
  meta?: Record<string, unknown>;
  type?: string;
}

/**
 * 从页面 .tsx 文件中提取 routeMeta
 * 匹配格式: export const routeMeta = { ... }
 */
function extractRouteMeta(filePath: string): Record<string, unknown> | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /export\s+const\s+routeMeta\s*=\s*(\{[\s\S]*?\})\s*;?\s*(?:\n|$)/;
    const match = content.match(regex);
    if (!match) return null;

    const jsonStr = match[1]
      .replace(/'/g, '"')
      .replace(/([{,])\s*([a-zA-Z_$][\w$]*)\s*:/g, '$1"$2":')
      .replace(/,\s*}/g, '}');
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * 生成路由代码（仅执行一次，结果缓存在模块作用域）
 */
let cachedRoutesCode: string | null = null;
let cachedPluginRoutes: RouteConfig[] = [];

function generateRoutesCode(pluginRoutes: RouteConfig[]): string {
  // 文件扫描路由
  const files = fg.sync('src/pages/**/*.tsx');
  const fileRoutes: RouteConfig[] = files.map((file) => {
    const routePath = file
      .replace('src/pages/', '')
      .replace(/\.tsx$/, '')
      .replace(/\/?index$/, '')
      .replace(/\[(\w+)\]/g, ':$1');

    const meta = extractRouteMeta(file) || {};

    return {
      path: '/' + routePath,
      file: '/' + file,
      meta,
      type: 'file',
    };
  });

  // 合并路由
  const routeMap = new Map<string, RouteConfig>();
  fileRoutes.forEach((r) => routeMap.set(r.path, r));
  pluginRoutes.forEach((r) => {
    const existing = routeMap.get(r.path);
    routeMap.set(r.path, {
      ...r,
      meta: r.meta || existing?.meta,
      type: 'plugin',
    });
  });

  const allRoutes = Array.from(routeMap.values());

  // 生成代码 — 使用静态导入消除 router.isReady() 的瀑布延迟
  // 浏览器能提前发现所有页面模块，无需等待懒加载的 HTTP 请求链
  const staticImports = allRoutes
    .filter((r) => r.file)
    .map((r, i) => `import __page${i} from '${r.file}'`)
    .join('\n');

  let fileIndex = 0;
  const routesArray = allRoutes
    .map((r) => {
      const metaStr = r.meta && Object.keys(r.meta).length > 0 ? `meta: ${JSON.stringify(r.meta)},` : '';
      if (r.redirect) {
        const redirectMeta = metaStr
          ? `{ path: '${r.path}', redirect: '${r.redirect}', ${metaStr} }`
          : `{ path: '${r.path}', redirect: '${r.redirect}' }`;
        return `  ${redirectMeta}`;
      }
      if (r.file) {
        return `  { path: '${r.path}', component: __page${fileIndex++}, ${metaStr} }`;
      }
      return '';
    })
    .filter(Boolean)
    .join(',\n');

  return `
    ${staticImports}

    export const routes = [
      ${routesArray}
    ]
  `;
}

export default function scanPagesPlugin(options: { pluginRoutes?: RouteConfig[] } = {}): Plugin {
  const { pluginRoutes = [] } = options;
  // 保存插件路由引用，当 options 改变时清空缓存
  cachedPluginRoutes = pluginRoutes;

  return {
    name: 'scan-pages-plugin',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_ID;
      }
      return null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;

      // 缓存生成结果，避免每次 load() 都重新扫描文件系统
      if (!cachedRoutesCode) {
        cachedRoutesCode = generateRoutesCode(cachedPluginRoutes);
      }
      return cachedRoutesCode;
    },

    // HMR：文件变化时清空缓存，触发重新生成
    handleHotUpdate() {
      cachedRoutesCode = null;
    },
  };
}
