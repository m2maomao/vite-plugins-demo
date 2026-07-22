import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Mock API 配置项
 *
 * key 为请求方法 + 路径，如 `'GET /api/routes'`
 * value 为静态数据或动态处理函数
 *
 * @example
 * ```ts
 * {
 *   'GET /api/routes': { status: 1, data: [...] },
 *   'POST /api/user/login': (body) => ({ status: 1, data: { token: 'xxx' } }),
 * }
 * ```
 */
export interface MockApis {
  [key: `${'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'} ${string}`]:
    unknown | ((body: Record<string, unknown>) => unknown);
}

/**
 * Mock API 插件选项
 */
export interface MockPluginOptions {
  /** 是否启用 mock API，默认 false */
  enabled?: boolean;
  /**
   * Mock 数据目录（相对于项目根目录）
   * 插件会自动扫描目录下所有 .json / .ts 文件并合并 API
   * @default './mock'
   */
  dir?: string;
  /**
   * 内联 Mock API 配置（优先级高于目录扫描）
   * 当同时配置了 dir 和 apis 时，apis 会覆盖同名路由
   */
  apis?: MockApis;
}

/**
 * 解析路由条目
 */
interface RouteEntry {
  method: string;
  url: string;
  isHandler: boolean;
  data: unknown;
}

/**
 * Mock API 插件
 *
 * 将 mock API 注入 Vite Dev Server，无需独立 Express 进程。
 * 数据可以来自 mock/ 目录（自动扫描）或 apis 参数（内联配置）。
 *
 * @example
 * ```ts
 * // 方式一：mock/ 目录自动扫描（推荐，类似 Umi）
 * mockPlugin({ enabled: true })
 *
 * // 方式二：内联配置
 * mockPlugin({
 *   enabled: true,
 *   apis: {
 *     'GET /api/routes': { status: 1, data: [] },
 *     'POST /api/user/login': (body) => ({ status: 1, data: { token: 'xxx' } }),
 *   },
 * })
 * ```
 */
export default function mockPlugin(options: MockPluginOptions = {}): Plugin {
  const { enabled = false, dir = './mock', apis = {} } = options;

  return {
    name: 'mock-plugin',

    configureServer(server: ViteDevServer) {
      if (!enabled) {
        console.log('📡 Mock API 已关闭（enabled: false）');
        return;
      }

      // 1. 从目录扫描加载 mock 数据
      const scannedApis = scanMockDir(server.config.root, dir);

      // 2. 合并 apis 参数（优先级高于目录扫描）
      const mergedApis = { ...scannedApis, ...apis };

      // 3. 解析路由表
      const routeEntries = parseRouteEntries(mergedApis);

      if (routeEntries.length === 0) {
        console.log('📡 Mock API 已启用，但未找到任何 API（mock/ 目录为空）');
        return;
      }

      // 4. 注册中间件
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const urlPath = req.url.split('?')[0];
        const method = req.method?.toUpperCase() || 'GET';

        const route = routeEntries.find((r) => r.method === method && matchUrl(r.url, urlPath));

        if (!route) return next();

        // 解析 body
        let body = '';
        if (method === 'POST' || method === 'PUT') {
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          await new Promise((resolve) => req.on('end', resolve));
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        try {
          let responseData: unknown;
          if (route.isHandler) {
            const handler = route.data as (body: Record<string, unknown>) => unknown;
            responseData = handler(body ? JSON.parse(body) : {});
          } else {
            responseData = route.data;
          }

          res.end(JSON.stringify(responseData));
          console.log(`📡 Mock: ${method} ${urlPath}`);
        } catch (err) {
          console.error(`[mock] ${method} ${urlPath} 处理出错:`, err);
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 0, message: 'Internal mock error' }));
        }
      });

      console.log(`📡 Mock API 已注入 Vite Dev Server（${routeEntries.length} 个路由）`);
    },
  };
}

// ============================================
// 目录扫描
// ============================================

/**
 * 扫描 mock 目录，合并所有文件中的 API 定义
 */
function scanMockDir(root: string, dir: string): MockApis {
  const mockDir = path.resolve(root, dir);

  if (!fs.existsSync(mockDir)) {
    return {};
  }

  const files = fs.readdirSync(mockDir).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    return {};
  }

  console.log(`📡 扫描 mock 目录（${mockDir}）：发现 ${files.length} 个文件`);

  const merged: MockApis = {};

  for (const file of files) {
    const filePath = path.join(mockDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const apis = JSON.parse(content) as MockApis;
      Object.assign(merged, apis);
      console.log(`   ├── ${file}（${Object.keys(apis).length} 个路由）`);
    } catch (err) {
      console.error(`   ├── ${file} 加载失败:`, err);
    }
  }

  return merged;
}

// ============================================
// 路由解析
// ============================================

function parseRouteEntries(apis: MockApis): RouteEntry[] {
  return Object.entries(apis).map(([key, value]) => {
    const [method, ...urlParts] = key.split(' ');
    const url = urlParts.join(' ');
    return {
      method: method.toUpperCase(),
      url,
      isHandler: typeof value === 'function',
      data: value,
    };
  });
}

/**
 * URL 匹配（支持 :id 动态参数）
 */
function matchUrl(pattern: string, actual: string): boolean {
  if (pattern === actual) return true;

  // 将 /api/user/:id 转为正则 /^\/api\/user\/[^/]+$/
  const regexStr = pattern.replace(/:[\w]+/g, '[^/]+');
  const regex = new RegExp(`^${regexStr}$`);
  return regex.test(actual);
}
