import { transform } from 'esbuild';
import fs from 'fs';
import path from 'path';
// 所有内置页面的映射
const BUILTIN_PAGES = {
    login: 'virtual:builtin/login',
    '404': 'virtual:builtin/404',
    loading: 'virtual:builtin/loading',
    error: 'virtual:builtin/error'
};
export default function builtinPlugin() {
    return {
        name: 'builtin-plugin',
        resolveId(id) {
            // 检查是否匹配任意内置页面
            for (const [, virtualId] of Object.entries(BUILTIN_PAGES)) {
                if (id === virtualId)
                    return '\0' + virtualId;
            }
        },
        async load(id) {
            // 去掉 \0 前缀后检查
            const rawId = id.replace(/^\0/, '');
            for (const [name, virtualId] of Object.entries(BUILTIN_PAGES)) {
                if (rawId === virtualId) {
                    const filePath = path.resolve(__dirname, `builtin-pages/${name}.tsx`);
                    const code = fs.readFileSync(filePath, 'utf-8');
                    const result = await transform(code, {
                        loader: 'tsx',
                        jsxFactory: 'h',
                        jsxFragment: 'Fragment',
                    });
                    return result.code;
                }
            }
        }
    };
}
