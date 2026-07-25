// plugins/scan-pages-plugin/index.ts
import fg from "fast-glob";
import fs from "fs";
var VIRTUAL_MODULE_ID = "virtual:routes";
var RESOLVED_ID = `\0` + VIRTUAL_MODULE_ID;
var LAYOUT_REGISTRY_ID = "virtual:layout-registry";
var RESOLVED_LAYOUT_REGISTRY = `\0` + LAYOUT_REGISTRY_ID;
function extractRouteMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const regex = /export\s+const\s+routeMeta\s*=\s*(\{[\s\S]*?\})\s*;?\s*(?:\n|$)/;
    const match = content.match(regex);
    if (!match) return null;
    const jsonStr = match[1].replace(/'/g, '"').replace(/([{,])\s*([a-zA-Z_$][\w$]*)\s*:/g, '$1"$2":').replace(/,\s*}/g, "}");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}
function buildRouteTree(files, pluginRoutes) {
  const root = { segment: "", children: [], isIndex: false };
  const fileConfigs = /* @__PURE__ */ new Map();
  for (const file of files) {
    const routePath = file.replace("src/pages/", "").replace(/\.tsx$/, "").replace(/\/?index$/, "").replace(/\[(\w+)\]/g, ":$1");
    const isIndexFile = file.endsWith("index.tsx") || file.endsWith("/index");
    fileConfigs.set(file, {
      config: {
        path: "/" + routePath,
        file: "/" + file,
        meta: extractRouteMeta(file) || {},
        type: "file"
      },
      isIndexOrig: isIndexFile
    });
  }
  for (const pr of pluginRoutes) {
    fileConfigs.set(pr.file || pr.path, { config: pr, isIndexOrig: false });
  }
  for (const [, { config, isIndexOrig }] of fileConfigs) {
    if (!config.file) continue;
    let routePath = config.path;
    if (routePath.startsWith("/")) routePath = routePath.slice(1);
    let segments = routePath.split("/");
    if (segments[segments.length - 1] === "index") segments = segments.slice(0, -1);
    if (segments.length === 1 && segments[0] === "") segments = [];
    let current = root;
    if (segments.length === 0) {
      let child = root.children.find((c) => c.segment === "");
      if (!child) {
        child = { segment: "", children: [], isIndex: false };
        root.children.push(child);
      }
      current = child;
    } else {
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        let child = current.children.find((c) => c.segment === seg);
        if (!child) {
          child = { segment: seg, children: [], isIndex: false };
          current.children.push(child);
        }
        current = child;
      }
    }
    current.file = config.file;
    current.meta = config.meta;
    current.redirect = config.redirect;
    current.type = config.type;
    current.isIndex = isIndexOrig && current.segment !== "";
  }
  return root;
}
function generateRouteCode(node, pageIndex, imports, isChild) {
  const collectImports = (n) => {
    if (n.file && !n.children.some((c) => c.isIndex)) {
      imports.push(`import __page${pageIndex.current} from '${n.file}'`);
      pageIndex.current++;
    }
    for (const child of n.children) {
      collectImports(child);
    }
  };
  if (!isChild) {
    const processNode = (n) => {
      const needsImport = n.file && // 根路由或没有子路由的普通页面
      (n.segment === "" || // 父路由（有子路由且是 index）
      n.isIndex && n.children.length > 0 || // 叶子页面
      n.children.length === 0);
      if (needsImport) {
        imports.push(`import __page${pageIndex.current} from '${n.file}'`);
        pageIndex.current++;
      }
      for (const child of n.children) {
        if (child === n) continue;
        processNode(child);
      }
    };
    processNode(node);
  }
  const genRoute = (n, useRelativePath) => {
    const isParent = n.isIndex && n.children.length > 0;
    const hasOwnPage = n.file && (n.isIndex || n.children.length === 0);
    const isLeaf = n.file && !n.isIndex && n.children.length === 0;
    if (n.redirect) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : "";
      return `{ path: '${n.segment}', redirect: '${n.redirect}'${metaStr ? ", " + metaStr : ""} }`;
    }
    if (isParent && isChild) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : "";
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx}`;
      const childrenCode = n.children.filter((c) => c !== n).map((c) => genRoute(c, true)).filter(Boolean).join(",\n");
      return `{ path: '${n.segment}', component: ${compName}, ${metaStr}
    children: [
${childrenCode}
    ]
  }`;
    }
    if (isParent && !isChild) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : "";
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx}`;
      const path2 = `'/${n.segment}'`;
      const childrenCode = n.children.filter((c) => c !== n && c.file).map((c) => genRoute(c, true)).filter(Boolean).join(",\n");
      return `{ path: ${path2}, component: ${compName}, ${metaStr}
    children: [
${childrenCode}
    ]
  }`;
    }
    if (isLeaf) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : "";
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx >= 0 ? pIdx : 0}`;
      return `{ path: '${n.segment}', component: ${compName}, ${metaStr} }`;
    }
    if (hasOwnPage && !isChild) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : "";
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx >= 0 ? pIdx : 0}`;
      return `{ path: '/${n.segment}', component: ${compName}, ${metaStr} }`;
    }
    const results = [];
    if (n.segment === "" && n.file) {
      const metaStr = n.meta && Object.keys(n.meta).length > 0 ? `meta: ${JSON.stringify(n.meta)},` : "";
      const pIdx = imports.findIndex((imp) => imp.includes(`'${n.file}'`));
      const compName = `__page${pIdx >= 0 ? pIdx : 0}`;
      if (n.children.length > 0) {
        const childrenCode = n.children.map((c) => genRoute(c, true)).filter(Boolean).join(",\n");
        results.push(`{ path: '/', component: ${compName}, ${metaStr}
    children: [
${childrenCode}
    ]
  }`);
      } else {
        results.push(`{ path: '/', component: ${compName}, ${metaStr} }`);
      }
    } else {
      for (const child of n.children) {
        let childCode = genRoute(child, false);
        if (childCode && child.file && child.segment !== "" && !child.isIndex) {
          childCode = childCode.replace(`path: '${child.segment}'`, `path: '/${child.segment}'`);
        }
        if (childCode) results.push(childCode);
      }
    }
    return results.join(",\n");
  };
  const code = genRoute(node, false);
  return code;
}
var cachedRoutesCode = null;
var cachedPluginRoutes = [];
function generateRoutesCode(pluginRoutes) {
  const files = fg.sync("src/pages/**/*.tsx");
  const tree = buildRouteTree(files, pluginRoutes);
  const pageIndex = { current: 0 };
  const imports = [];
  const routesCode = generateRouteCode(tree, pageIndex, imports, false);
  return `
    ${imports.join("\n")}

    export const routes = [
      ${routesCode}
    ]
  `;
}
function scanPagesPlugin(options = {}) {
  cachedPluginRoutes = options.pluginRoutes || [];
  function scanLayoutFiles() {
    return fg.sync("src/layouts/*.tsx").filter((f) => !f.endsWith("index.tsx"));
  }
  let cachedLayoutCode = null;
  function generateLayoutCode() {
    const layoutFiles = scanLayoutFiles();
    if (layoutFiles.length === 0) return "export const layoutRegistry = {};";
    const imports = layoutFiles.map((f, i) => {
      const name = f.replace("src/layouts/", "").replace(/\.tsx$/, "");
      return `import __layout${i} from '/${f}'`;
    }).join("\n");
    const entries = layoutFiles.map((f, i) => {
      const name = f.replace("src/layouts/", "").replace(/\.tsx$/, "");
      return `"${name}": __layout${i}`;
    }).join(",\n");
    return `
      ${imports}

      export const layoutRegistry = {
        ${entries}
      };
    `;
  }
  return {
    name: "scan-pages-plugin",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
      if (id === LAYOUT_REGISTRY_ID) return RESOLVED_LAYOUT_REGISTRY;
      return null;
    },
    load(id) {
      if (id === RESOLVED_LAYOUT_REGISTRY) {
        if (!cachedLayoutCode) cachedLayoutCode = generateLayoutCode();
        return cachedLayoutCode;
      }
      if (id !== RESOLVED_ID) return null;
      if (!cachedRoutesCode) {
        cachedRoutesCode = generateRoutesCode(cachedPluginRoutes);
      }
      return cachedRoutesCode;
    },
    handleHotUpdate() {
      cachedRoutesCode = null;
      cachedLayoutCode = null;
    }
  };
}

// plugins/api-plugin/index.ts
import fg2 from "fast-glob";
var VIRTUAL_MODULE_ID2 = "virtual:api";
var RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID2;
function apiPlugin() {
  return {
    name: "api-plugin",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID2) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return null;
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
var BUILTIN_PAGE_CODES = {
  login: [
    `import { defineComponent, h, ref } from 'vue';`,
    `import { useRouter } from 'vue-router';`,
    `import { useUserStore } from 'deer-mobile/stores';`,
    ``,
    `export const routeMeta = { layout: 'blank', auth: false, title: '登录' };`,
    ``,
    `export default defineComponent({`,
    `  name: 'LoginPage',`,
    `  setup() {`,
    `    const router = useRouter();`,
    `    const userStore = useUserStore();`,
    `    const username = ref('');`,
    `    const password = ref('');`,
    `    const loading = ref(false);`,
    `    const handleLogin = async () => {`,
    `      if (loading.value) return;`,
    `      loading.value = true;`,
    `      try {`,
    `        const token = 'demo-token-' + Date.now();`,
    `        userStore.setToken(token);`,
    `        localStorage.setItem('token', token);`,
    `        await router.push('/');`,
    `      } catch (error) {`,
    `        console.error('Login failed:', error);`,
    `      } finally {`,
    `        loading.value = false;`,
    `      }`,
    `    };`,
    `    return () => h('div', { class: 'max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-lg' }, [`,
    `      h('h2', { class: 'text-2xl text-center mb-6 font-bold' }, '登录'),`,
    `      h('div', { class: 'mb-4' }, [`,
    `        h('input', { placeholder: '用户名', value: username.value,`,
    `          onInput: (e) => { username.value = e.target.value; },`,
    `          class: 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500' })`,
    `      ]),`,
    `      h('div', { class: 'mb-4' }, [`,
    `        h('input', { placeholder: '密码', type: 'password', value: password.value,`,
    `          onInput: (e) => { password.value = e.target.value; },`,
    `          class: 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500' })`,
    `      ]),`,
    `      h('button', { onClick: handleLogin, disabled: loading.value,`,
    `        class: 'w-full py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed' },`,
    `        loading.value ? '登录中...' : '登录')`,
    `    ]);`,
    `  },`,
    `});`
  ].join("\n"),
  "404": [
    `import { defineComponent, h } from 'vue';`,
    `import { useRouter } from 'vue-router';`,
    `export default defineComponent({`,
    `  setup() {`,
    `    const router = useRouter();`,
    `    return () => h('div', { class: 'text-center mt-20' }, [`,
    `      h('h1', { class: 'text-6xl font-bold text-gray-300' }, '404'),`,
    `      h('p', { class: 'text-gray-500 mt-4' }, '页面未找到'),`,
    `      h('button', { onClick: () => router.push('/'),`,
    `        class: 'mt-6 px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700' }, '返回首页')`,
    `    ]);`,
    `  },`,
    `});`
  ].join("\n"),
  loading: [
    `import { defineComponent, h } from 'vue';`,
    `export default defineComponent({`,
    `  setup() {`,
    `    return () => h('div', { class: 'flex items-center justify-center min-h-[60vh]' },`,
    `      h('p', { class: 'text-gray-400 text-lg' }, '加载中...'));`,
    `  },`,
    `});`
  ].join("\n"),
  error: [
    `import { defineComponent, h } from 'vue';`,
    `export default defineComponent({`,
    `  props: { message: { type: String, default: '出了点问题' } },`,
    `  setup(props) {`,
    `    return () => h('div', { class: 'text-center mt-20' }, [`,
    `      h('p', { class: 'text-4xl text-red-400' }, '⚠️'),`,
    `      h('p', { class: 'text-gray-500 mt-4' }, props.message),`,
    `    ]);`,
    `  },`,
    `});`
  ].join("\n"),
  "pinia-demo": [
    `import { defineComponent, h, ref } from 'vue';`,
    `import { useUserStore } from 'deer-mobile/stores';`,
    `export default defineComponent({`,
    `  setup() {`,
    `    const userStore = useUserStore();`,
    `    const inputToken = ref('');`,
    `    const handleSetToken = () => { if (inputToken.value) userStore.setToken(inputToken.value); };`,
    `    const handleLogout = () => { userStore.logout(); };`,
    `    return () => h('div', { class: 'max-w-sm mx-auto mt-10 p-6 border border-gray-200 rounded-lg' }, [`,
    `      h('h2', { class: 'text-2xl text-center mb-6 font-bold' }, 'Pinia 调试页'),`,
    `      h('div', { class: 'mb-6 p-4 bg-gray-50 rounded' }, [`,
    `        h('p', { class: 'mb-2' }, [`,
    `          h('span', { class: 'font-bold' }, '登录状态：'),`,
    `          h('span', { class: userStore.isLoggedIn ? 'text-green-600' : 'text-red-500' },`,
    `            userStore.isLoggedIn ? '已登录' : '未登录')`,
    `        ]),`,
    `        h('p', { class: 'mb-2' }, [`,
    `          h('span', { class: 'font-bold' }, 'Token：'),`,
    `          h('code', { class: 'text-sm bg-gray-200 px-2 py-1 rounded break-all' }, userStore.token || '(空)')`,
    `        ]),`,
    `      ]),`,
    `      h('div', { class: 'mb-4' }, [`,
    `        h('label', { class: 'block text-sm font-bold mb-2' }, '设置 Token'),`,
    `        h('div', { class: 'flex gap-2' }, [`,
    `          h('input', { placeholder: '输入 token...', value: inputToken.value,`,
    `            onInput: (e) => { inputToken.value = e.target.value; },`,
    `            class: 'flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500' }),`,
    `          h('button', { onClick: handleSetToken,`,
    `            class: 'px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700' }, '设置')`,
    `        ]),`,
    `      ]),`,
    `      h('button', { onClick: handleLogout,`,
    `        class: 'w-full py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600' }, '退出登录')`,
    `    ]);`,
    `  },`,
    `});`
  ].join("\n")
};
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
    load(id) {
      const rawId = id.replace(/^\0/, "");
      for (const [name, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (rawId === virtualId) {
          return BUILTIN_PAGE_CODES[name] || `export default { template: '<div>Page not found: ${name}</div>' }`;
        }
      }
    }
  };
}

// plugins/mock-plugin/index.ts
import fs2 from "fs";
import path from "path";
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
  const mockDir = path.resolve(root, dir);
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
    const filePath = path.join(mockDir, file);
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

// plugins/setup-plugin/build-api.ts
var BuildAPIImpl = class {
  constructor(state, getConfig, getRoutes) {
    this.state = state;
    this._getConfig = getConfig;
    this._getRoutes = getRoutes;
  }
  state;
  currentDescriptor = null;
  _getConfig;
  _getRoutes;
  // ========== 1. 插件描述 ==========
  describe(descriptor) {
    this.currentDescriptor = descriptor;
    this.state.descriptors.push(descriptor);
  }
  // ========== 2. 生命周期钩子 ==========
  onInit(fn) {
    this.state.initFns.push(fn);
  }
  modifyConfig(fn) {
    this.state.modifyConfigFns.push(fn);
  }
  modifyRoutes(fn) {
    this.state.modifyRoutesFns.push(fn);
  }
  onGenerate(fn) {
    this.state.generateFns.push(fn);
  }
  onBuildComplete(fn) {
    this.state.buildCompleteFns.push(fn);
  }
  onDevCompileDone(fn) {
    this.state.devCompileDoneFns.push(fn);
  }
  // ========== 3. Service API ==========
  addRuntimePlugin(plugin) {
    this.state.runtimePlugins.push(plugin);
  }
  addEntryCode(code, options) {
    this.state.entryCodes.push({ code, ahead: options?.ahead ?? false });
  }
  addImport(specifier, source) {
    this.state.imports.push(`import ${specifier} from '${source}'`);
  }
  addHTMLScript(script) {
    this.state.htmlScripts.push(script);
  }
  addHTMLHeadScript(script) {
    this.state.htmlHeadScripts.push(script);
  }
  addBeforeMiddlewares(middleware) {
    this.state.middlewares.push(middleware);
  }
  addTmpGenerateWatcherPaths(paths) {
    this.state.watcherPaths.push(...paths);
  }
  // ========== 4. 插件注册 ==========
  registerPlugin(plugin) {
    if (Array.isArray(plugin)) {
      plugin.forEach((p) => this.state.registeredPlugins.push(p));
    } else if (typeof plugin === "function") {
      this.state.registeredPlugins.push(plugin);
    }
  }
  // ========== 5. 插件间通信 ==========
  registerMethod(name, fn) {
    this.state.methods.set(name, fn);
  }
  callMethod(name, ...args) {
    const fn = this.state.methods.get(name);
    if (fn) return fn(...args);
    console.warn(`[Deer] callMethod: "${name}" 未注册`);
    return void 0;
  }
  hasMethod(name) {
    return this.state.methods.has(name);
  }
  // ========== 6. 工具 ==========
  getConfig() {
    return this._getConfig();
  }
  getRoutes() {
    return this._getRoutes();
  }
  getRuntimePlugins() {
    return this.state.runtimePlugins;
  }
  logger = {
    info: (msg) => console.log(`[Deer:BuildPlugin] ${msg}`),
    warn: (msg) => console.warn(`[Deer:BuildPlugin] ${msg}`),
    error: (msg) => console.error(`[Deer:BuildPlugin] ${msg}`)
  };
};

// plugins/setup-plugin/code-gen.ts
var BUILTIN_PLUGIN_PATHS = {
  deer_piniaPlugin: "deer-mobile/runtime/pinia",
  deer_i18nPlugin: "deer-mobile/runtime/i18n",
  deer_authPlugin: "deer-mobile/runtime/auth",
  deer_apiPlugin: "deer-mobile/runtime/api"
};
function generateLayoutPluginCode() {
  return [
    "import { h } from 'vue';",
    "import __deer_layoutComponent__ from 'deer-mobile/layouts';",
    "const __deer_layoutPlugin__ = {",
    "  name: 'deer:layout',",
    "  priority: 0,",
    "  rootContainer() {",
    "    return () => h(__deer_layoutComponent__);",
    "  },",
    "};"
  ].join("\n");
}
function generateSetupAppCode(state, options) {
  const { appConfigPath = "virtual:app-config", routesPath = "virtual:routes" } = options;
  const pluginImports = collectPluginImports(state.runtimePlugins);
  const importStmts = pluginImports.map((i) => i.importStmt).filter(Boolean).join("\n");
  const inlineCodes = pluginImports.map((i) => i.inlineCode).filter(Boolean).join("\n\n");
  const pluginRegistrations = state.runtimePlugins.map((_p, i) => `  pluginManager.use(${pluginImports[i]?.variable || `__plugin_${i}__`});`).join("\n");
  const sortedCodes = [...state.entryCodes].sort((a, b) => {
    if (a.ahead && !b.ahead) return -1;
    if (!a.ahead && b.ahead) return 1;
    return 0;
  });
  const entryCodesStr = sortedCodes.map((c) => c.code).join("\n");
  const code = [
    "// ============================================",
    "// Deer Mobile — Auto-generated App Entry",
    "// ============================================",
    "import { PluginManager, createRuntimeApp } from 'deer-mobile/runtime';",
    `import { appConfig } from '${appConfigPath}';`,
    `import { routes as staticRoutes } from '${routesPath}';`,
    importStmts,
    "",
    "// ---- 框架内置插件 ----",
    generateLayoutPluginCode(),
    "",
    "// ---- 用户自定义插件 ----",
    inlineCodes,
    "",
    "// ---- 初始化 PluginManager ----",
    "const pluginManager = new PluginManager(appConfig);",
    "",
    "// ---- 注册运行时插件 ----",
    "pluginManager.use(__deer_layoutPlugin__);",
    pluginRegistrations,
    "",
    "// ---- 入口注入代码 ----",
    entryCodesStr,
    "",
    "// ---- 启动 ----",
    "async function startApp() {",
    "  // 1. 立即启动应用（使用静态路由），不再等待远程路由",
    "  const runtimeApp = createRuntimeApp({",
    "    pluginManager,",
    "    routes: staticRoutes,",
    "    appConfig,",
    '  }).catch(err => console.error("[Deer] Runtime Error:", err));',
    "",
    "  // 2. 并行获取远程路由（不阻塞应用启动）",
    '  fetch("/api/routes")',
    "    .then(res => {",
    "      if (!res.ok) throw new Error('HTTP ' + res.status);",
    "      return res.json();",
    "    })",
    "    .then(result => {",
    "      const serverRoutes = result.data || [];",
    "      if (serverRoutes.length > 0 && pluginManager.getContext().router) {",
    "        const router = pluginManager.getContext().router;",
    "        serverRoutes.forEach(r => {",
    "          if (r.redirect) {",
    "            router.addRoute({ path: r.path, redirect: r.redirect });",
    "          }",
    "        });",
    "        console.log('🌐 已加载 ' + serverRoutes.length + ' 个远程路由');",
    "      }",
    "    })",
    "    .catch(e => console.warn('⚠️ 远程路由加载失败:', e));",
    "",
    "  await runtimeApp;",
    "}",
    "",
    "startApp();"
  ].join("\n");
  return code;
}
function collectPluginImports(plugins) {
  return plugins.map((plugin, index) => {
    const name = plugin.name || `plugin_${index}`;
    const variable = name.replace(/[-:]/g, "_").replace(/[^a-zA-Z0-9_]/g, "") + "Plugin";
    const builtinPath = BUILTIN_PLUGIN_PATHS[variable];
    if (builtinPath) {
      return {
        variable,
        importStmt: `import { default as ${variable} } from '${builtinPath}';`,
        inlineCode: ""
      };
    }
    return {
      variable,
      importStmt: "",
      inlineCode: generateInlinePluginCode(plugin, variable)
    };
  });
}
function generateInlinePluginCode(plugin, varName) {
  const hooks = [];
  const hookNames = [
    "onAppCreated",
    "onRouterCreated",
    "onRouterReady",
    "onBeforeMount",
    "onMounted",
    "rootContainer",
    "innerProvider",
    "outerProvider",
    "onPageEnter",
    "onPageLeave",
    "onRouteChange",
    "patchRoutes",
    "onHistoryChange",
    "onError"
  ];
  for (const hook of hookNames) {
    const fn = plugin[hook];
    if (fn) {
      hooks.push(`  ${hook}: ${fn.toString()},`);
    }
  }
  return [
    `const ${varName} = {`,
    `  name: '${plugin.name}',`,
    `  priority: ${plugin.priority ?? 10},`,
    ...hooks,
    "};"
  ].join("\n");
}

// plugins/setup-plugin/index.ts
var VIRTUAL_SETUP_APP = "virtual:setup-app";
var RESOLVED_SETUP_APP = "\0" + VIRTUAL_SETUP_APP;
var VIRTUAL_APP_CONFIG = "virtual:app-config";
var RESOLVED_APP_CONFIG = "\0" + VIRTUAL_APP_CONFIG;
var DEFAULT_CONFIG = {
  title: "My App",
  description: "A Vite-powered app",
  author: "deer",
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
function deer(options = {}) {
  console.log("[Deer] deer() function CALLED");
  const state = {
    descriptors: [],
    modifyConfigFns: [],
    modifyRoutesFns: [],
    initFns: [],
    generateFns: [],
    buildCompleteFns: [],
    devCompileDoneFns: [],
    runtimePlugins: [...options.runtimePlugins ?? []],
    entryCodes: [],
    imports: [],
    htmlScripts: [],
    htmlHeadScripts: [],
    middlewares: [],
    watcherPaths: [],
    methods: /* @__PURE__ */ new Map(),
    registeredPlugins: []
  };
  let appConfig = {
    ...DEFAULT_CONFIG,
    ...options.config,
    theme: { ...DEFAULT_CONFIG.theme, ...options.config?.theme },
    request: { ...DEFAULT_CONFIG.request, ...options.config?.request }
  };
  const routes = [];
  const buildAPI = new BuildAPIImpl(
    state,
    () => appConfig,
    () => routes
  );
  const allBuildPlugins = collectBuildPlugins(options, buildAPI);
  allBuildPlugins.forEach((plugin) => {
    try {
      plugin(buildAPI);
    } catch (err) {
      console.error(`[Deer] BuildPlugin 初始化失败:`, err);
    }
  });
  return {
    name: "deer:setup",
    // ==========================================
    // config — 修改 Vite 配置
    // ==========================================
    config(viteConfig) {
      for (const fn of state.modifyConfigFns) {
        const result = fn(appConfig);
        if (result) appConfig = result;
      }
      return {
        base: appConfig.base,
        esbuild: {
          ...viteConfig.esbuild
        }
      };
    },
    // ==========================================
    // resolveId — 处理虚拟模块
    // ==========================================
    resolveId(id) {
      if (id === VIRTUAL_SETUP_APP) return RESOLVED_SETUP_APP;
      if (id === VIRTUAL_APP_CONFIG) return RESOLVED_APP_CONFIG;
      return null;
    },
    // ==========================================
    // load — 生成虚拟模块内容
    // ==========================================
    load(id) {
      if (id === RESOLVED_APP_CONFIG) {
        return `export const appConfig = ${JSON.stringify(appConfig)};`;
      }
      if (id === RESOLVED_SETUP_APP) {
        const code = generateSetupAppCode(state, {
          appConfigPath: VIRTUAL_APP_CONFIG,
          routesPath: "virtual:routes"
        });
        console.log(`[Deer] virtual:setup-app generated (${code.length} chars)`);
        return code;
      }
      return null;
    },
    // ==========================================
    // transform — 自动注入到 main.ts
    // ==========================================
    transform(code, id) {
      if (id.includes("main")) {
        console.log("[Deer:Debug] transform called for:", id.substring(id.length - 40));
        console.log("[Deer:Debug] code preview:", code.substring(0, 100));
      }
      if (id.includes("src/main.ts") || id.includes("src/main.tsx")) {
        if (!code.includes(VIRTUAL_SETUP_APP)) {
          console.log("[Deer:Debug] injecting virtual:setup-app into main.ts");
          return {
            code: `import '${VIRTUAL_SETUP_APP}';
${code}`,
            map: null
          };
        }
      }
      return null;
    },
    // ==========================================
    // configureServer — Dev Server 中间件
    // ==========================================
    configureServer(server) {
      state.middlewares.forEach((mw) => {
        server.middlewares.use(mw);
      });
      if (state.watcherPaths.length > 0) {
        state.watcherPaths.forEach((watchPath) => {
          server.watcher.add(watchPath);
        });
      }
    },
    // ==========================================
    // buildStart — 初始化阶段
    // ==========================================
    async buildStart() {
      for (const fn of state.initFns) {
        await fn();
      }
    },
    // ==========================================
    // buildEnd — 构建完成
    // ==========================================
    buildEnd() {
      const duration = 0;
      for (const fn of state.buildCompleteFns) {
        fn({ duration, routes });
      }
    },
    // ==========================================
    // handleHotUpdate — 开发编译完成
    // ==========================================
    async handleHotUpdate() {
      for (const fn of state.devCompileDoneFns) {
        fn({ duration: 0, isFirstCompile: false });
      }
    },
    // ==========================================
    // transformIndexHtml — 注入 HTML 脚本
    // ==========================================
    transformIndexHtml() {
      const tags = [];
      state.htmlHeadScripts.forEach((script) => {
        tags.push({
          tag: "script",
          injectTo: "head",
          attrs: {
            ...script.src ? { src: script.src } : {},
            ...script.attrs,
            ...script.async ? { async: "" } : {},
            ...script.defer ? { defer: "" } : {}
          },
          ...script.content ? { children: script.content } : {}
        });
      });
      state.htmlScripts.forEach((script) => {
        tags.push({
          tag: "script",
          injectTo: "body",
          attrs: {
            ...script.src ? { src: script.src } : {},
            ...script.attrs,
            ...script.async ? { async: "" } : {},
            ...script.defer ? { defer: "" } : {}
          },
          ...script.content ? { children: script.content } : {}
        });
      });
      return tags;
    }
  };
}
function collectBuildPlugins(options, api) {
  const plugins = [];
  if (options.modifyRoutes || options.modifyConfig || options.onGenerate) {
    const anonymousPlugin = (buildApi) => {
      if (options.modifyRoutes) {
        buildApi.modifyRoutes(options.modifyRoutes);
      }
      if (options.modifyConfig) {
        buildApi.modifyConfig(options.modifyConfig);
      }
      if (options.onGenerate) {
        buildApi.onGenerate(options.onGenerate);
      }
    };
    plugins.push(anonymousPlugin);
  }
  if (options.presets) {
    for (const preset of options.presets) {
      if (Array.isArray(preset)) {
        plugins.push(...preset);
      } else if (typeof preset === "function") {
        plugins.push(preset);
      }
    }
  }
  if (options.buildPlugins) {
    plugins.push(...options.buildPlugins);
  }
  return plugins;
}

// plugins/runtime/pinia-plugin.ts
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
var piniaRuntimePlugin = {
  name: "deer:pinia",
  priority: 0,
  onAppCreated: (app) => {
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
  }
};
var pinia_plugin_default = piniaRuntimePlugin;

// plugins/runtime/i18n-plugin.ts
import { watch } from "vue";
import { createI18n } from "vue-i18n";
import { setLocale } from "kangaroo-mobile";
var i18nRuntimePlugin = {
  name: "deer:i18n",
  priority: 5,
  onAppCreated: (app, ctx) => {
    const i18nConfig = ctx.config.i18n;
    if (!i18nConfig?.messages) return;
    const i18n = createI18n({
      locale: i18nConfig.locale ?? "zh-CN",
      fallbackLocale: i18nConfig.fallbackLocale ?? "zh-CN",
      messages: i18nConfig.messages ?? {},
      legacy: false
    });
    app.use(i18n);
    ctx.data.set("i18n", i18n);
  },
  onRouterCreated: (_router, ctx) => {
    const i18n = ctx.data.get("i18n");
    if (!i18n?.global?.locale) return;
    watch(
      () => i18n.global.locale.value,
      (newLang) => {
        if (newLang) setLocale(newLang);
      },
      { immediate: true }
    );
  }
};
var i18n_plugin_default = i18nRuntimePlugin;

// src/stores/userStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
var useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const isLoggedIn = computed(() => !!token.value);
    function setToken(newToken) {
      token.value = newToken;
    }
    function logout() {
      token.value = "";
    }
    return {
      token,
      isLoggedIn,
      setToken,
      logout
    };
  },
  { persist: true }
);

// plugins/runtime/auth-plugin.ts
var authRuntimePlugin = {
  name: "deer:auth",
  priority: 1,
  onRouterCreated: (router, ctx) => {
    const noAuthPages = ctx.config.noNavPages ?? ["/login", "/404"];
    router.beforeEach((to) => {
      if (to.meta?.auth === false) return;
      if (noAuthPages.includes(to.path)) return;
      try {
        const userStore = useUserStore();
        if (userStore.token) {
          return;
        }
        return "/login";
      } catch {
      }
      const token = localStorage.getItem("token");
      if (!token) {
        return "/login";
      }
    });
  }
};
var auth_plugin_default = authRuntimePlugin;

// plugins/runtime/api-plugin.ts
var apiRuntimePlugin = {
  name: "deer:api",
  priority: 10,
  onAppCreated: async (app, ctx) => {
    const api = ctx.data.get("api");
    if (api) {
      app.config.globalProperties.$api = api;
      app.provide("$api", api);
    }
  }
};
var api_plugin_default = apiRuntimePlugin;

// src/runtime/plugin-manager.ts
var PluginManager = class {
  plugins = [];
  context;
  constructor(config) {
    this.context = this.createContext(config);
  }
  // ============================================
  // 插件注册
  // ============================================
  /** 注册一个运行时插件（自动按 priority 排序） */
  use(plugin) {
    this.plugins.push(plugin);
    this.plugins.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
    return this;
  }
  /** 批量注册插件 */
  useMany(plugins) {
    plugins.forEach((p) => this.use(p));
    return this;
  }
  // ============================================
  // 生命周期执行
  // ============================================
  /** 执行指定生命周期的所有钩子 */
  async callHook(hook, ...args) {
    for (const plugin of this.plugins) {
      const fn = plugin[hook];
      if (fn) {
        try {
          await fn(...args, this.context);
        } catch (err) {
          console.error(`[Deer:Plugin] "${plugin.name}" hook "${hook}" 执行失败:`, err);
        }
      }
    }
  }
  // ============================================
  // Provider 嵌套处理
  // ============================================
  /**
   * 执行 rootContainer 链——构建 Provider 嵌套结构
   *
   * 执行顺序（从外到内）:
   *   outerProvider → rootContainer → innerProvider
   *
   * 例如:
   *   outer:  SentryProvider
   *   root:   AnalyticsProvider
   *   inner:  ThemeProvider
   *   → <SentryProvider><AnalyticsProvider><ThemeProvider><App /></ThemeProvider></AnalyticsProvider></SentryProvider>
   */
  composeRootContainer(renderApp) {
    let container = renderApp;
    for (const plugin of this.plugins) {
      if (plugin.innerProvider) {
        const wrap = plugin.innerProvider;
        const prev = container;
        container = () => wrap(prev);
      }
    }
    for (const plugin of this.plugins) {
      if (plugin.rootContainer) {
        const wrap = plugin.rootContainer;
        const prev = container;
        container = () => {
          const result = wrap(prev, this.context);
          return typeof result === "function" ? result() : result;
        };
      }
    }
    for (const plugin of this.plugins) {
      if (plugin.outerProvider) {
        const wrap = plugin.outerProvider;
        const prev = container;
        container = () => wrap(prev);
      }
    }
    return container;
  }
  // ============================================
  // Context 管理
  // ============================================
  /** 获取运行时上下文 */
  getContext() {
    return this.context;
  }
  /** 设置 App 实例 */
  setApp(app) {
    this.context.app = app;
  }
  /** 设置 Router 实例 */
  setRouter(router) {
    this.context.router = router;
  }
  /** 获取已注册的所有插件 */
  getPlugins() {
    return [...this.plugins];
  }
  // ============================================
  // 私有方法
  // ============================================
  createContext(config) {
    return {
      app: null,
      router: null,
      config,
      data: /* @__PURE__ */ new Map(),
      // 这些方法会在 setApp/setRouter 后被实际功能替换
      addRouterGuard: () => {
        console.warn("[Deer] addRouterGuard: router 未就绪");
      },
      addRoute: () => {
        console.warn("[Deer] addRoute: router 未就绪");
      },
      removeRoute: () => {
        console.warn("[Deer] removeRoute: router 未就绪");
      },
      getRoutes: () => [],
      addLayout: () => {
        console.warn("[Deer] addLayout: app 未就绪");
      },
      setLayout: () => {
        console.warn("[Deer] setLayout: app 未就绪");
      }
    };
  }
};

// src/runtime/create-app.ts
import { createApp, h } from "vue";
import { createRouter, createWebHistory, createWebHashHistory, RouterView } from "vue-router";
async function createRuntimeApp(options) {
  const perf = (label) => console.log(`[Perf] ${label}`, performance.now().toFixed(0));
  perf("createRuntimeApp start");
  const { pluginManager, routes, appConfig, historyMode = "web" } = options;
  const ctx = pluginManager.getContext();
  const history = historyMode === "hash" ? createWebHashHistory(appConfig.base) : createWebHistory(appConfig.base);
  const router = createRouter({
    history,
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.meta?.scrollTop !== void 0) return { top: to.meta.scrollTop, left: 0 };
      return { top: 0, left: 0 };
    }
  });
  ctx.router = router;
  perf("router created");
  const renderRoot = pluginManager.composeRootContainer(() => h(RouterView));
  const app = createApp({
    setup() {
      return renderRoot;
    }
  });
  ctx.app = app;
  perf("app created");
  await pluginManager.callHook("onAppCreated", app);
  perf("onAppCreated done");
  router.beforeEach((to, from, next) => {
    pluginManager.callHook("onPageLeave", from);
    next();
  });
  router.beforeEach((to) => {
    const rules = to.meta?.params;
    if (!rules) return;
    for (const [key, rule] of Object.entries(rules)) {
      const value = to.params[key];
      if (rule.required && (value === void 0 || value === "")) {
        console.warn(`[Route] 参数 "${key}" 为必填，跳转 404`);
        return "/404";
      }
      if (rule.type === "number" && value !== void 0 && isNaN(Number(value))) {
        console.warn(`[Route] 参数 "${key}" 应为数字，实际: "${value}"，跳转 404`);
        return "/404";
      }
      if (rule.min !== void 0 && value !== void 0 && Number(value) < rule.min) {
        console.warn(`[Route] 参数 "${key}" 最小值 ${rule.min}，实际: ${value}，跳转 404`);
        return "/404";
      }
      if (rule.max !== void 0 && value !== void 0 && Number(value) > rule.max) {
        console.warn(`[Route] 参数 "${key}" 最大值 ${rule.max}，实际: ${value}，跳转 404`);
        return "/404";
      }
      if (rule.pattern && value !== void 0 && !new RegExp(rule.pattern).test(value)) {
        console.warn(`[Route] 参数 "${key}" 不匹配规则 ${rule.pattern}，实际: "${value}"，跳转 404`);
        return "/404";
      }
    }
  });
  router.afterEach((to, from) => {
    pluginManager.callHook("onRouteChange", to, from);
    pluginManager.callHook("onPageEnter", to);
  });
  await pluginManager.callHook("onRouterCreated", router);
  perf("onRouterCreated done");
  app.use(router);
  await router.isReady();
  perf("router.isReady done");
  await pluginManager.callHook("onRouterReady", router);
  perf("onRouterReady done");
  app.config.errorHandler = (err) => {
    console.error("[Deer] Error:", err);
    pluginManager.callHook("onError", err);
  };
  await pluginManager.callHook("onBeforeMount", app);
  app.mount("#app");
  perf("app.mount done");
  await pluginManager.callHook("onMounted");
}
export {
  PluginManager,
  apiPlugin,
  api_plugin_default as apiRuntimePlugin,
  auth_plugin_default as authRuntimePlugin,
  builtinPlugin,
  createRuntimeApp,
  deer,
  i18n_plugin_default as i18nRuntimePlugin,
  mockPlugin,
  pinia_plugin_default as piniaRuntimePlugin,
  scanPagesPlugin
};
