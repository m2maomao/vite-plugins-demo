import type { Plugin } from 'vite';
import { getFrameworkPlugins } from './_shared';

const VIRTUAL_MODULE_ID = 'virtual:setup-app';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export default function setupPlugin(): Plugin {
  // 自动获取
  const frameworkPlugins = getFrameworkPlugins();
  return {
    name: 'setup-plugin',

    // 1、虚拟模块 - 生成启动代码
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        // 分开收集 import 和 runtime
        const moduleImports = frameworkPlugins
          .filter(p => p.onImport)
          .map(p => p.onImport!())
          .join('\n');

        // 收集插件注入的运行时代码
        const runtimeCodes = frameworkPlugins
          .filter(p => p.onRuntime)
          .map(p => p.onRuntime!())
          .join('\n');

        return `
          ${moduleImports} // 放模块顶部
          import { createApp, h } from 'vue';
          import { createRouter, createWebHistory, RouterView } from 'vue-router';
          import { routes as staticRoutes } from 'virtual:routes';
          import Layout from '/src/layouts/index.tsx';
          import '/src/style.css';

          async function setupApp() {
            let serverRoutes = [];
            try {
              const response = await fetch('/api/routes');
              const result = await response.json();
              serverRoutes = result.data || [];
            } catch (e) {
              console.warn('⚠️ 服务端未启动，跳过远程路由');
            }
            
            const routeMap = new Map();
            staticRoutes.forEach(r => routeMap.set(r.path, {...r, source: 'static'}));
            serverRoutes.forEach(r => routeMap.set(r.path, {...r, source: 'server'}));
            console.log('📃 静态路由：', staticRoutes);
            console.log('🌐 服务器路由：', serverRoutes);
            console.log('📍 合并后路由：', Array.from(routeMap.values()));
            const router = createRouter({
              history: createWebHistory(),
              routes: Array.from(routeMap.values()),
            });

            const app = createApp(Layout);

            // 执行插件注入的运行时代码(先注册 $api)
            ${runtimeCodes}

            app.use(router);
            app.mount('#app');
          }
          setupApp();
        `
      }
    },

    // 2、transform - 向 main.tsx 注入 import
    transform(code, id) {
      if (id.includes('src/main.ts')) {
        // 如果没有导入虚拟模块，就自动加上
        if (!code.includes(VIRTUAL_MODULE_ID)) {
          return {
            code: `import '${VIRTUAL_MODULE_ID}';\n${code}`,
            map: null,
          }
        }
      }
    }
  }
}