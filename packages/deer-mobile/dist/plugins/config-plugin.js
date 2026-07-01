import { setFrameworkPlugins } from './_shared';
// 2、默认配置
const DEFAULT_CONFIG = {
    title: 'My App',
    description: 'A Vite-powered app',
    author: 'zhangguolong',
    base: '/',
    theme: {
        primaryColor: '#1890ff',
        darkMode: false,
    },
    layout: 'side',
    noNavPages: ['/login', '/404']
};
// 4、插件函数
// 新增：虚拟模块标识符
const VIRTUAL_MODULE_ID = 'virtual:app-config';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;
export default function configPlugin(options = {}, frameworkPlugins = []) {
    // 保存到共享状态
    setFrameworkPlugins(frameworkPlugins);
    // 合并用户配置和默认配置
    const mergedConfig = {
        ...DEFAULT_CONFIG,
        ...options
    };
    return {
        name: 'config-plugin',
        // 新增：config 钩子，可以修改 Vite 配置
        config() {
            console.log('⚙️ 应用配置：', mergedConfig);
            console.log('🔌 框架插件：', frameworkPlugins.map(p => p.name));
            return {
                base: mergedConfig.base,
            };
        },
        // 新增：处理 import 'virtual:app-config'
        resolveId(id) {
            if (id === VIRTUAL_MODULE_ID) {
                return RESOLVED_VIRTUAL_MODULE_ID;
            }
        },
        load(id) {
            if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                return `export const appConfig = ${JSON.stringify(mergedConfig)}`;
            }
        }
    };
}
