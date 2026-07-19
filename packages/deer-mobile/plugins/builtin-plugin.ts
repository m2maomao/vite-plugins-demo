import type { Plugin } from 'vite';
import { transform } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 所有内置页面的映射
const BUILTIN_PAGES: Record<string, string> = {
  login: 'virtual:builtin/login',
  '404': 'virtual:builtin/404',
  loading: 'virtual:builtin/loading',
  error: 'virtual:builtin/error',
  'pinia-demo': 'virtual:builtin/pinia-demo',
};

export default function builtinPlugin(): Plugin {
  return {
    name: 'builtin-plugin',

    resolveId(id) {
      // 检查是否匹配任意内置页面
      for (const [, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (id === virtualId) return '\0' + virtualId;
      }
    },

    async load(id) {
      // 去掉 \0 前缀后检查
      const rawId = id.replace(/^\0/, '');
      for (const [name, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (rawId === virtualId) {
          const currentDir = path.dirname(fileURLToPath(import.meta.url));
          const filePath = path.resolve(currentDir, `plugins/builtin-pages/${name}.tsx`);
          const code = fs.readFileSync(filePath, 'utf-8');
          const result = await transform(code, {
            loader: 'tsx',
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
          });
          return result.code;
        }
      }
    },
  };
}
