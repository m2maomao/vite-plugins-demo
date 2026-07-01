import fg from 'fast-glob';
const VIRTUAL_MODULE_ID = 'virtual:api';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;
export default function apiPlugin() {
    return {
        name: 'api-plugin',
        resolveId(id) {
            if (id === VIRTUAL_MODULE_ID) {
                return RESOLVED_VIRTUAL_MODULE_ID;
            }
        },
        load(id) {
            if (id !== RESOLVED_VIRTUAL_MODULE_ID)
                return null;
            // 扫描 src/api// 下所有 .ts 文件（排除 index.ts）
            const files = fg.sync('src/api/*.ts')
                .filter(f => !f.endsWith('index.ts'));
            // 生成 import 语句
            const imports = files.map((f, i) => {
                const varName = `api${i}`;
                return `import ${varName} from '/${f}'`;
            }).join('\n');
            // 生成 DI 注入 + API 对象
            const apiEntries = files.map((f, i) => {
                const varName = `api${i}`;
                const moduleName = f.replace('src/api/', '').replace(/\.ts$/, '');
                return `"${moduleName}": ${varName}({ $get, $post, $put, $delete })`;
            }).join(',\n');
            return `
        ${imports}
        import { http } from '/src/utils/request'

        const $get = (url, config) => http.get(url, config)
        const $post = (url, data, config) => http.post(url, data, config)
        const $put = (url, data, config) => http.put(url, data, config)
        const $delete = (url, config) => http.delete(url, config)

        export const api = {
          ${apiEntries}
        }
      `;
        }
    };
}
