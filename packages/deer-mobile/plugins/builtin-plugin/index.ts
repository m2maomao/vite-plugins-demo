import type { Plugin } from 'vite';
import { transform } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
      for (const [, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (id === virtualId) return '\0' + virtualId;
      }
    },

    async load(id) {
      const rawId = id.replace(/^\0/, '');
      for (const [name, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (rawId === virtualId) {
          // import.meta.url 指向: .../deer-mobile/index.js (built) 或 .../deer-mobile/plugins/builtin-plugin/index.ts (source)
          const modulePath = fileURLToPath(import.meta.url);
          const deerMobileRoot = modulePath.includes('plugins/builtin-plugin')
            ? path.resolve(modulePath, '..', '..') // source: .../plugins/builtin-plugin/ → 上2层到 deer-mobile
            : path.resolve(modulePath, '..'); // built:  .../deer-mobile/ → 上1层到 deer-mobile
          const pagesDir = path.resolve(deerMobileRoot, 'plugins', 'builtin-plugin', 'pages');
          const filePath = path.resolve(pagesDir, `${name}.tsx`);

          if (!fs.existsSync(filePath)) {
            return `export default { template: '<div>Page not found: ${name}</div>' }`;
          }

          // 告诉 Vite 监听源文件变化，触发 HMR
          this.addWatchFile(filePath);

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
