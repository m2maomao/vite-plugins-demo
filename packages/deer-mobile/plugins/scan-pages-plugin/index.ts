import type { Plugin } from 'vite';
import fg from 'fast-glob';
import fs from 'fs';

const VIRTUAL_MODULE_ID = 'virtual:routes';
const RESOLVED_ID = `\0` + VIRTUAL_MODULE_ID;

const LAYOUT_REGISTRY_ID = 'virtual:layout-registry';
const RESOLVED_LAYOUT_REGISTRY = `\0` + LAYOUT_REGISTRY_ID;

interface RouteConfig {
  path: string;
  file?: string;
  redirect?: string;
  meta?: Record<string, unknown>;
  type?: string;
}

/** 路由树节点 */
interface RouteNode {
  segment: string; // 'user' 或 'profile' 或 ''(根)
  file?: string; // 对应的源文件路径
  meta?: Record<string, unknown>;
  redirect?: string;
  type?: string;
  children: RouteNode[];
  isIndex: boolean; // 是否为 index.tsx（目录路由）
}

/**
 * 从页面 .tsx 文件中提取 routeMeta
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
 * 构建路由树：将扁平的页面列表转换为嵌套的树结构
 */
function buildRouteTree(files: string[], pluginRoutes: RouteConfig[]): RouteNode {
  const root: RouteNode = { segment: '', children: [], isIndex: false };

  // 1. 构建文件路径 → RouteConfig 的映射
  const fileConfigs = new Map<string, { config: RouteConfig; isIndexOrig: boolean }>();
  for (const file of files) {
    const routePath = file
      .replace('src/pages/', '')
      .replace(/\.tsx$/, '')
      .replace(/\/?index$/, '')
      .replace(/\[(\w+)\]/g, ':$1');

    // 原始文件名是否以 index.tsx 结尾
    const isIndexFile = file.endsWith('index.tsx') || file.endsWith('/index');

    fileConfigs.set(file, {
      config: {
        path: '/' + routePath,
        file: '/' + file,
        meta: extractRouteMeta(file) || {},
        type: 'file',
      },
      isIndexOrig: isIndexFile,
    });
  }

  // 应用 pluginRoutes 覆盖
  for (const pr of pluginRoutes) {
    fileConfigs.set(pr.file || pr.path, { config: pr, isIndexOrig: false });
  }

  // 2. 构建树
  for (const [, { config, isIndexOrig }] of fileConfigs) {
    if (!config.file) continue; // 跳过纯 redirect

    // 使用 config.path 确定路由在树中的位置（已提前去除 index）
    let routePath = config.path;
    if (routePath.startsWith('/')) routePath = routePath.slice(1);
    let segments = routePath.split('/');
    if (segments[segments.length - 1] === 'index') segments = segments.slice(0, -1);
    if (segments.length === 1 && segments[0] === '') segments = [];

    // 沿路径创建/查找节点
    let current = root;
    // 根路由（path='/'）：不覆盖 root，而是创建子节点
    if (segments.length === 0) {
      // 查找已有的 '' 节点（其他插件路由可能已创建）
      let child = root.children.find((c) => c.segment === '');
      if (!child) {
        child = { segment: '', children: [], isIndex: false };
        root.children.push(child);
      }
      current = child;
    } else {
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        let child = current.children.find((c) => c.segment === seg);
        if (!child) {
          child = { segment: seg, children: [], isIndex: false };
          current.children.push(child);
        }
        current = child;
      }
    }

    // 在叶子节点上设置路由信息
    current.file = config.file;
    current.meta = config.meta;
    current.redirect = config.redirect;
    current.type = config.type;
    // 只有子目录的 index 才视为父路由（user/ 等）
    // 根路径（segment === ''）的 index 不视为父路由
    current.isIndex = isIndexOrig && current.segment !== '';
  }

  return root;
}

/**
 * 递归生成路由代码（JS 源码字符串）
 */
function generateRouteCode(
  node: RouteNode,
  pageIndex: { current: number },
  imports: string[],
  isChild: boolean,
): string {
  // 收集所有需要 import 的页面
  const collectImports = (n: RouteNode) => {
    if (n.file && !n.children.some((c) => c.isIndex)) {
      // 只在叶子节点或没有子 index 的节点上生成 import
      imports.push(`import __page${pageIndex.current} from '${n.file}'`);
      pageIndex.current++;
    }
    for (const child of n.children) {
      collectImports(child);
    }
  };

  // 第一次调用时收集所有 import
  if (!isChild) {
    // 只从有 file 的节点收集 import
    const processNode = (n: RouteNode) => {
      // 作为独立路由有 file → 分配 import
      const needsImport =
        n.file &&
        // 根路由或没有子路由的普通页面
        (n.segment === '' ||
          // 父路由（有子路由且是 index）
          (n.isIndex && n.children.length > 0) ||
          // 叶子页面
          n.children.length === 0);

      if (needsImport) {
        imports.push(`import __page${pageIndex.current} from '${n.file}'`);
        pageIndex.current++;
      }

      // 有子路由但不使用自己的 component：子路由需要 import（通过 file 不是自己的 children）
      // 递归处理
      for (const child of n.children) {
        if (child === n) continue; // guard
        processNode(child);
      }
    };
    processNode(node);
  }

  // 生成单个路由的记录
  // useRelativePath = true 表示使用相对路径（作为子路由）
  const genRoute = (n: RouteNode, useRelativePath: boolean): string => {
    const isParent = n.isIndex && n.children.length > 0;
    const hasOwnPage = n.file && (n.isIndex || n.children.length === 0);
    const isLeaf = n.file && !n.isIndex && n.children.length === 0;

    if (n.redirect) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : '';
      return `{ path: '${n.segment}', redirect: '${n.redirect}'${metaStr ? ', ' + metaStr : ''} }`;
    }

    if (isParent && isChild) {
      // 父路由作为子路由：需要 component + children
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : '';
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx}`;
      const childrenCode = n.children
        .filter((c) => c !== n)
        .map((c) => genRoute(c, true))
        .filter(Boolean)
        .join(',\n');
      return `{ path: '${n.segment}', component: ${compName}, ${metaStr}\n    children: [\n${childrenCode}\n    ]\n  }`;
    }

    if (isParent && !isChild) {
      // 父路由（有 index.tsx 的目录，如 user/），children 使用相对路径
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : '';
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx}`;
      const path = `'/${n.segment}'`;
      const childrenCode = n.children
        .filter((c) => c !== n && c.file) // 只处理有文件的子节点
        .map((c) => genRoute(c, true)) // 子路由 isChild=true → 使用相对路径
        .filter(Boolean)
        .join(',\n');
      return `{ path: ${path}, component: ${compName}, ${metaStr}\n    children: [\n${childrenCode}\n    ]\n  }`;
    }

    if (isLeaf) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : '';
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx >= 0 ? pIdx : 0}`;
      // 子路由用相对路径（不带/），根路由由调用方处理
      return `{ path: '${n.segment}', component: ${compName}, ${metaStr} }`;
    }

    if (hasOwnPage && !isChild) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : '';
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx >= 0 ? pIdx : 0}`;
      return `{ path: '/${n.segment}', component: ${compName}, ${metaStr} }`;
    }

    // 根节点（segment === ''）或中间节点：迭代子路由
    const results: string[] = [];

    // 如果根节点自己有 file（index.tsx），首先生成它自己的路由
    if (n.segment === '' && n.file) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : '';
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx >= 0 ? pIdx : 0}`;
      // 如果根节点有子路由，作为父路由；否则作为普通路由
      if (n.children.length > 0) {
        const childrenCode = n.children
          .map((c) => genRoute(c, true))
          .filter(Boolean)
          .join(',\n');
        results.push(`{ path: '/', component: ${compName}, ${metaStr}\n    children: [\n${childrenCode}\n    ]\n  }`);
      } else {
        results.push(`{ path: '/', component: ${compName}, ${metaStr} }`);
      }
    } else {
      // 普通中间节点：迭代子路由
      for (const child of n.children) {
        let childCode = genRoute(child, false);
        // 顶层路由（segment !== ''）的叶子节点加 / 前缀
        if (childCode && child.file && child.segment !== '' && !child.isIndex) {
          childCode = childCode.replace(`path: '${child.segment}'`, `path: '/${child.segment}'`);
        }
        if (childCode) results.push(childCode);
      }
    }
    return results.join(',\n');
  };

  const code = genRoute(node, false);
  return code;
}

/**
 * 生成路由代码
 */
let cachedRoutesCode: string | null = null;
let cachedPluginRoutes: RouteConfig[] = [];

function generateRoutesCode(pluginRoutes: RouteConfig[]): string {
  const files = fg.sync('src/pages/**/*.tsx');
  const tree = buildRouteTree(files, pluginRoutes);

  const pageIndex = { current: 0 };
  const imports: string[] = [];
  const routesCode = generateRouteCode(tree, pageIndex, imports, false);

  return `
    ${imports.join('\n')}

    export const routes = [
      ${routesCode}
    ]
  `;
}

export default function scanPagesPlugin(options: { pluginRoutes?: RouteConfig[] } = {}): Plugin {
  cachedPluginRoutes = options.pluginRoutes || [];

  /** 扫描 src/layouts/ 目录，返回布局文件列表 */
  function scanLayoutFiles(): string[] {
    return fg.sync('src/layouts/*.tsx').filter((f) => !f.endsWith('index.tsx'));
  }

  /** 生成布局注册表代码 */
  let cachedLayoutCode: string | null = null;
  function generateLayoutCode(): string {
    const layoutFiles = scanLayoutFiles();
    if (layoutFiles.length === 0) return 'export const layoutRegistry = {};';

    const imports = layoutFiles
      .map((f, i) => {
        const name = f.replace('src/layouts/', '').replace(/\.tsx$/, '');
        return `import __layout${i} from '/${f}'`;
      })
      .join('\n');

    const entries = layoutFiles
      .map((f, i) => {
        const name = f.replace('src/layouts/', '').replace(/\.tsx$/, '');
        return `"${name}": __layout${i}`;
      })
      .join(',\n');

    return `
      ${imports}

      export const layoutRegistry = {
        ${entries}
      };
    `;
  }

  return {
    name: 'scan-pages-plugin',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
      if (id === LAYOUT_REGISTRY_ID) return RESOLVED_LAYOUT_REGISTRY;
      return null;
    },

    load(id) {
      if (id === RESOLVED_LAYOUT_REGISTRY) {
        if (!cachedLayoutCode) cachedLayoutCode = generateLayoutCode();
        return cachedLayoutCode;
      }
      if (id !== RESOLVED_ID) return null;
      if (!cachedRoutesCode) {
        cachedRoutesCode = generateRoutesCode(cachedPluginRoutes);
      }
      return cachedRoutesCode;
    },

    handleHotUpdate() {
      cachedRoutesCode = null;
      cachedLayoutCode = null;
    },
  };
}
