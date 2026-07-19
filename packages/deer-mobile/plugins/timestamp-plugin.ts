import type { Plugin } from 'vite';
export default function timestampPlugin(): Plugin {
  return {
    name: 'timestamp-plugin',
    transform(code, id) {
      // id: 文件的绝对路径
      // code: 文件的源代码

      // 只处理 src 目录下的 .ts 文件
      if (id.includes('/src') && (id.endsWith('.ts') || id.endsWith('.js'))) {
        const now = new Date().toLocaleString();
        console.log(`处理文件: ${id.replace(process.cwd(), '')}`);

        return {
          code: `console.log('📅 这个文件构建于: ${now}');\n${code}`,
          map: null, // 不生成sourcemap
        };
      }

      // 返回 null 或 undefined 标识不处理此模块
    },
  };
}
