// plugins/_shared.ts
var plugins = [];
function setFrameworkPlugins(p) {
  plugins = p;
}
function getFrameworkPlugins() {
  return plugins;
}

// plugins/config-plugin/index.ts
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

// plugins/setup-plugin/index.ts
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

// plugins/scan-pages-plugin/index.ts
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

// plugins/api-plugin/index.ts
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

// plugins/builtin-plugin/index.ts
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
          const filePath = path.resolve(currentDir, `plugins/builtin-plugin/pages/${name}.tsx`);
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

// plugins/auth-plugin/index.ts
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

// plugins/pinia-plugin/index.ts
var piniaPlugin = {
  name: "pinia",
  onImport: () => [`import { createPinia } from 'pinia'`, `import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'`].join(
    "\n"
  ),
  onRuntime: () => [`const pinia = createPinia()`, `pinia.use(piniaPluginPersistedstate)`, `app.use(pinia)`].join("\n")
};
var pinia_plugin_default = piniaPlugin;

// plugins/i18n-plugin/index.ts
var i18nPlugin = {
  name: "i18n",
  onImport: () => [
    `import { createI18n } from 'vue-i18n'`,
    `import { watch } from 'vue'`,
    `import { setLocale } from 'kangaroo-mobile'`,
    `import { appConfig } from 'virtual:app-config'`
  ].join("\n"),
  onRuntime: () => {
    return [
      `// i18n: 仅在配置了翻译文案时启用`,
      `if (appConfig.i18n?.messages) {`,
      `  const i18n = createI18n({`,
      `    locale: appConfig.i18n?.locale ?? 'zh-CN',`,
      `    fallbackLocale: appConfig.i18n?.fallbackLocale ?? 'zh-CN',`,
      `    messages: appConfig.i18n?.messages ?? {},`,
      `    legacy: false,`,
      `  })`,
      ``,
      `  app.use(i18n)`,
      ``,
      `  // 监听语言切换，同步 kangaroo-mobile 的 UI 组件文案`,
      `  if (i18n.global.locale) {`,
      `    watch(`,
      `      () => i18n.global.locale.value,`,
      `      (newLang) => {`,
      `        if (newLang) setLocale(newLang)`,
      `      },`,
      `      { immediate: true },`,
      `    )`,
      `  }`,
      `}`
    ].join("\n");
  }
};
var i18n_plugin_default = i18nPlugin;

// plugins/mock-plugin/index.ts
import fs2 from "fs";
import path2 from "path";
function mockPlugin(options = {}) {
  const { enabled = false, dir = "./mock", apis = {} } = options;
  return {
    name: "mock-plugin",
    configureServer(server) {
      if (!enabled) {
        console.log("📡 Mock API 已关闭（enabled: false）");
        return;
      }
      const scannedApis = scanMockDir(server.config.root, dir);
      const mergedApis = { ...scannedApis, ...apis };
      const routeEntries = parseRouteEntries(mergedApis);
      if (routeEntries.length === 0) {
        console.log("📡 Mock API 已启用，但未找到任何 API（mock/ 目录为空）");
        return;
      }
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        const urlPath = req.url.split("?")[0];
        const method = req.method?.toUpperCase() || "GET";
        const route = routeEntries.find((r) => r.method === method && matchUrl(r.url, urlPath));
        if (!route) return next();
        let body = "";
        if (method === "POST" || method === "PUT") {
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          await new Promise((resolve) => req.on("end", resolve));
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        try {
          let responseData;
          if (route.isHandler) {
            const handler = route.data;
            responseData = handler(body ? JSON.parse(body) : {});
          } else {
            responseData = route.data;
          }
          res.end(JSON.stringify(responseData));
          console.log(`📡 Mock: ${method} ${urlPath}`);
        } catch (err) {
          console.error(`[mock] ${method} ${urlPath} 处理出错:`, err);
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 0, message: "Internal mock error" }));
        }
      });
      console.log(`📡 Mock API 已注入 Vite Dev Server（${routeEntries.length} 个路由）`);
    }
  };
}
function scanMockDir(root, dir) {
  const mockDir = path2.resolve(root, dir);
  if (!fs2.existsSync(mockDir)) {
    return {};
  }
  const files = fs2.readdirSync(mockDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    return {};
  }
  console.log(`📡 扫描 mock 目录（${mockDir}）：发现 ${files.length} 个文件`);
  const merged = {};
  for (const file of files) {
    const filePath = path2.join(mockDir, file);
    try {
      const content = fs2.readFileSync(filePath, "utf-8");
      const apis = JSON.parse(content);
      Object.assign(merged, apis);
      console.log(`   ├── ${file}（${Object.keys(apis).length} 个路由）`);
    } catch (err) {
      console.error(`   ├── ${file} 加载失败:`, err);
    }
  }
  return merged;
}
function parseRouteEntries(apis) {
  return Object.entries(apis).map(([key, value]) => {
    const [method, ...urlParts] = key.split(" ");
    const url = urlParts.join(" ");
    return {
      method: method.toUpperCase(),
      url,
      isHandler: typeof value === "function",
      data: value
    };
  });
}
function matchUrl(pattern, actual) {
  if (pattern === actual) return true;
  const regexStr = pattern.replace(/:[\w]+/g, "[^/]+");
  const regex = new RegExp(`^${regexStr}$`);
  return regex.test(actual);
}
export {
  apiPlugin,
  authPlugin,
  builtinPlugin,
  configPlugin,
  i18n_plugin_default as i18nPlugin,
  mockPlugin,
  pinia_plugin_default as piniaPlugin,
  scanPagesPlugin,
  setupPlugin
};
