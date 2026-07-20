// plugins/_shared.ts
var plugins = [];
function setFrameworkPlugins(p) {
  plugins = p;
}
function getFrameworkPlugins() {
  return plugins;
}

// plugins/config-plugin.ts
var DEFAULT_CONFIG = {
  title: "My App",
  description: "A Vite-powered app",
  author: "zhangguolong",
  base: "/",
  theme: {
    primaryColor: "#1890ff",
    darkMode: false
  },
  layout: "side",
  noNavPages: ["/login", "/404"],
  request: {
    baseURL: "/api"
  }
};
var VIRTUAL_MODULE_ID = "virtual:app-config";
var RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;
function configPlugin(options = {}, frameworkPlugins = []) {
  setFrameworkPlugins(frameworkPlugins);
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...options
  };
  return {
    name: "config-plugin",
    // 新增：config 钩子，可以修改 Vite 配置
    config() {
      return {
        base: mergedConfig.base
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

// plugins/setup-plugin.ts
var VIRTUAL_MODULE_ID2 = "virtual:setup-app";
var RESOLVED_VIRTUAL_MODULE_ID2 = "\0" + VIRTUAL_MODULE_ID2;
function setupPlugin() {
  const frameworkPlugins = getFrameworkPlugins();
  return {
    name: "setup-plugin",
    // 1、虚拟模块 - 生成启动代码
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID2) {
        return RESOLVED_VIRTUAL_MODULE_ID2;
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID2) {
        const moduleImports = frameworkPlugins.filter((p) => p.onImport).map((p) => p.onImport()).join("\n");
        const runtimeCodes = frameworkPlugins.filter((p) => p.onRuntime).map((p) => p.onRuntime()).join("\n");
        return `
          ${moduleImports} // 放模块顶部
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
              const result = await response.json();
              serverRoutes = result.data || [];
            } catch (e) {
              console.warn('⚠️ 服务端未启动，跳过远程路由');
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
      if (id.includes("src/main.ts")) {
        if (!code.includes(VIRTUAL_MODULE_ID2)) {
          return {
            code: `import '${VIRTUAL_MODULE_ID2}';
${code}`,
            map: null
          };
        }
      }
    }
  };
}

// plugins/scan-pages-plugin.ts
import fg from "fast-glob";
var VIRTUAL_MODULE_ID3 = "virtual:routes";
var RESOLVED_ID = `\0` + VIRTUAL_MODULE_ID3;
function scanPagesPlugin(options = {}) {
  const { pluginRoutes = [] } = options;
  return {
    name: "scan-pages-plugin",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID3) {
        return RESOLVED_ID;
      }
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const files = fg.sync("src/pages/**/*.tsx");
      const fileRoutes = files.map((file) => {
        const routePath = file.replace("src/pages/", "").replace(/\.tsx$/, "").replace(/\/?index$/, "").replace(/\[(\w+)\]/g, ":$1");
        return {
          path: "/" + routePath,
          file: "/" + file
        };
      });
      const routeMap = /* @__PURE__ */ new Map();
      fileRoutes.forEach((r) => routeMap.set(r.path, { ...r, type: "file" }));
      pluginRoutes.forEach((r) => routeMap.set(r.path, { ...r, type: "plugin" }));
      const allRoutes = Array.from(routeMap.values());
      const dynamicImports = allRoutes.filter((r) => r.file).map((r, i) => `const route${i} = () => import('${r.file}')`).join("\n");
      let fileIndex = 0;
      const routesArray = allRoutes.map((r) => {
        if (r.redirect) {
          return `  { path: '${r.path}', redirect: '${r.redirect}' }`;
        }
        if (r.file) {
          return `  { path: '${r.path}', component: route${fileIndex++} }`;
        }
        return "";
      }).filter(Boolean).join(",\n");
      return `
        ${dynamicImports}

        export const routes = [
          ${routesArray}
        ]
      `;
    }
  };
}

// plugins/api-plugin.ts
import fg2 from "fast-glob";
var VIRTUAL_MODULE_ID4 = "virtual:api";
var RESOLVED_VIRTUAL_MODULE_ID3 = "\0" + VIRTUAL_MODULE_ID4;
function apiPlugin() {
  return {
    name: "api-plugin",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID4) {
        return RESOLVED_VIRTUAL_MODULE_ID3;
      }
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID3) return null;
      const files = fg2.sync("src/api/*.ts").filter((f) => !f.endsWith("index.ts"));
      const imports = files.map((f, i) => {
        const varName = `api${i}`;
        return `import ${varName} from '/${f}'`;
      }).join("\n");
      const apiEntries = files.map((f, i) => {
        const varName = `api${i}`;
        const moduleName = f.replace("src/api/", "").replace(/\.ts$/, "");
        return `"${moduleName}": ${varName}({ $get, $post, $put, $delete })`;
      }).join(",\n");
      return `
        ${imports}
        import { http } from 'deer-mobile/utils'

        const $get = (url, config) => http.get(url, config)
        const $post = (url, data, config) => http.post(url, data, config)
        const $put = (url, data, config) => http.put(url, data, config)
        const $delete = (url, config) => http.delete(url, config)

        export const api = {
          ${apiEntries ? apiEntries + "," : ""}
          user: {
            login: (data) => http.post('/user/login', data),
            getProfile: (id) => http.get('/user/' + id),
          }
        }
      `;
    }
  };
}

// plugins/builtin-plugin.ts
import { transform } from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var BUILTIN_PAGES = {
  login: "virtual:builtin/login",
  "404": "virtual:builtin/404",
  loading: "virtual:builtin/loading",
  error: "virtual:builtin/error",
  "pinia-demo": "virtual:builtin/pinia-demo"
};
function builtinPlugin() {
  return {
    name: "builtin-plugin",
    resolveId(id) {
      for (const [, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (id === virtualId) return "\0" + virtualId;
      }
    },
    async load(id) {
      const rawId = id.replace(/^\0/, "");
      for (const [name, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (rawId === virtualId) {
          const currentDir = path.dirname(fileURLToPath(import.meta.url));
          const filePath = path.resolve(currentDir, `plugins/builtin-pages/${name}.tsx`);
          const code = fs.readFileSync(filePath, "utf-8");
          const result = await transform(code, {
            loader: "tsx",
            jsxFactory: "h",
            jsxFragment: "Fragment"
          });
          return result.code;
        }
      }
    }
  };
}

// plugins/auth-plugin.ts
function authPlugin() {
  return {
    name: "auth-plugin",
    transform(code, id) {
      if (id.includes("virtual:setup-app")) {
        return {
          code: code.replace(
            `import { createApp, h, ref } from 'vue';`,
            `import { createApp, h, ref } from 'vue';
import { useUserStore } from 'deer-mobile/stores';`
          ).replace(
            "app.use(router);",
            `
              // 路由守卫：未登录跳转登录页
              router.beforeEach((to) => {
                const userStore = useUserStore()
                const noAuthPages = ['/login', '/404']
                if (!userStore.token && !noAuthPages.includes(to.path)) {
                  return '/login'
                }
              })
              app.use(router);
            `
          ),
          map: null
        };
      }
    }
  };
}

// plugins/pinia-plugin.ts
var piniaPlugin = {
  name: "pinia",
  onImport: () => [`import { createPinia } from 'pinia'`, `import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'`].join(
    "\n"
  ),
  onRuntime: () => [`const pinia = createPinia()`, `pinia.use(piniaPluginPersistedstate)`, `app.use(pinia)`].join("\n")
};
var pinia_plugin_default = piniaPlugin;
export {
  apiPlugin,
  authPlugin,
  builtinPlugin,
  configPlugin,
  pinia_plugin_default as piniaPlugin,
  scanPagesPlugin,
  setupPlugin
};
