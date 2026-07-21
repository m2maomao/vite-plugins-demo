import type { Plugin } from 'vite';
import { getFrameworkPlugins } from '../_shared';

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
          .filter((p) => p.onImport)
          .map((p) => p.onImport!())
          .join('\n');

        // 收集插件注入的运行时代码
        const runtimeCodes = frameworkPlugins
          .filter((p) => p.onRuntime)
          .map((p) => p.onRuntime!())
          .join('\n');

        return `
          ${moduleImports} // 放模块顶部
          import 'deer-mobile/style.css';
          import { createApp, h, ref } from 'vue';
          import { createRouter, createWebHistory, RouterView, useRouter } from 'vue-router';
          import { routes as staticRoutes } from 'virtual:routes';
          import Layout from 'deer-mobile/layouts';
          import { setupFlexible } from 'deer-mobile/utils';

          // 移动端 rem 适配（按设计稿 375px 等比缩放）
          setupFlexible();

          async function setupApp() {
            let serverRoutes = [];
            try {
              const response = await fetch('/api/routes');
              if (!response.ok) throw new Error('HTTP ' + response.status);
              const result = await response.json();
              serverRoutes = result.data || [];
            } catch (e) {
              console.warn('⚠️ 服务端未启动，跳过远程路由');
              try {
                const { showToast } = await import('kangaroo-mobile');
                showToast('无法连接后端服务，部分功能不可用');
              } catch (toastErr) {
                console.warn('[Toast] 显示失败:', toastErr);
              }
            }
            
            const routeMap = new Map();
            staticRoutes.forEach(r => routeMap.set(r.path, {...r, source: 'static'}));
            serverRoutes.forEach(r => routeMap.set(r.path, {...r, source: 'server'}));
            // console.log('📃 静态路由：', staticRoutes);
            // console.log('🌐 服务器路由：', serverRoutes);
            // console.log('📍 合并后路由：', Array.from(routeMap.values()));
            const router = createRouter({
              history: createWebHistory(),
              routes: Array.from(routeMap.values()),
            });

            const App = {
              setup() {
                const router = useRouter()
                const isReady = ref(false)
                router.isReady().then(() => { isReady.value = true })
                return () => isReady.value ? h(Layout) : null
              }
            }
            const app = createApp(App);

            // 执行插件注入的运行时代码(先注册 $api)
            ${runtimeCodes}

            app.use(router);
            app.mount('#app');
          }
          setupApp();
        `;
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
          };
        }
      }
    },
  };
}
