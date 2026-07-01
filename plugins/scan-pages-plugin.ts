import type { Plugin } from 'vite';
import fg from 'fast-glob';

const VIRTUAL_MODULE_ID = 'virtual:routes';
const RESOLVED_ID = `\0` + VIRTUAL_MODULE_ID;

// 定义路由配置类型
interface RouteConfig {
  path: string;
  // 可以是组件路径，也可以是重定向
  file?: string;
  redirect?: string;
  type?: string;
}

// 插件现在接收 pluginRoutes参数
export default function scanPagesPlugin(options: 
  { pluginRoutes?: RouteConfig[] } = {}
): Plugin {
  const { pluginRoutes = [] } = options;

  return {
    name: 'scan-pages-plugin',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_ID;
      }
      return null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null

      // 1、文件扫描路由（优先级最低）
      const files = fg.sync('src/pages/**/*.tsx')
      // 将文件路径转换为路由配置
      const fileRoutes = files.map(file => {
        // 去掉 src/pages/ 前缀和 .tsx 后缀
        // eg: src/pages/user/profile.tsx -> user/profile
        const routePath = file
          .replace('src/pages/', '')
          .replace(/\.tsx$/, '')
          // index 转换为 ''(首页)
          .replace(/\/?index$/, '')
          // 动态路由 [id] -> :id
          .replace(/\[(\w+)\]/g, ':$1') // 
        return {
          path: '/' + routePath,
          file: '/' + file
        }
      })

      // 2、合并路由：文件路由 + 插件路由（插件覆盖文件）
      // 用Map去重，后添加的覆盖前面的
      const routeMap = new Map<string, RouteConfig>()

      // 先放文件扫描的（优先级最低）
      fileRoutes.forEach(r => routeMap.set(r.path, {...r, type: 'file'}))
      // 再放插件注入的（覆盖同路径的文件路由）
      pluginRoutes.forEach(r => routeMap.set(r.path, {...r, type: 'plugin'}))

      const allRoutes = Array.from(routeMap.values())

      // 3、生成代码
      const dynamicImports = allRoutes
        .filter(r => r.file)
        .map((r, i) => `const route${i} = () => import('${r.file}')`)
        .join('\n')
      
      // 给有file的生成component，有redirect的生成redirect
      let fileIndex = 0;
      const routesArray = allRoutes.map(r => {
        if (r.redirect) {
          return `  { path: '${r.path}', redirect: '${r.redirect}' }`
        }
        if (r.file) {
          return `  { path: '${r.path}', component: route${fileIndex++} }`
        }
        return ''
      }).filter(Boolean).join(',\n')

      return `
        ${dynamicImports}

        export const routes = [
          ${routesArray}
        ]
      `;
    },
    buildStart() {
      const files = fg.sync('src/pages/**/*.tsx')
      console.log('📃 扫描到以下页面：')
      files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`))
    }
  }
}