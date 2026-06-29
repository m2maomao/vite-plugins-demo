import { createApp, defineComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes as staticRoutes } from 'virtual:routes';
import { appConfig } from 'virtual:app-config';

async function setupApp() {
  console.log('🎨 应用配置：', appConfig);
  // 服务器路由
  let serverRoutes: any[] = [];
  try {
    const response = await fetch('/api/routes');
    const result = await response.json();
    serverRoutes = result.data || [];
    console.log('🌐 服务端路由：', serverRoutes);
  } catch (e) {
    console.warn('⚠️ 服务端未启动，跳过远程路由');
  }
  console.log('📃 静态路由（文件 + 插件）：', staticRoutes);

  // 合并三层路由
  // 用Map去重，先放静态路由，再放服务器路由（覆盖同路径）
  const routerMap = new Map<string, any>();
  staticRoutes.forEach((r: any) => routerMap.set(r.path, { ...r, source: 'static'}));
  serverRoutes.forEach((r: any) => routerMap.set(r.path, { ...r, source: 'server'}));

  const allRoutes = Array.from(routerMap.values());
  console.log('📍 合并后全部路由：', allRoutes);

  // 创建路由实例
  const router = createRouter({
    history: createWebHistory(),
    routes: allRoutes,
  });

  // 创建 Vue 应用并挂载
  const App = defineComponent({
    setup() {
      return () => <router-view />
    }
  })
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}

setupApp();
