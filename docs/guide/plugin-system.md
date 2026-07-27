# 插件系统

Deer Mobile 采用**双阶段插件架构**：BuildPlugin（构建时）+ RuntimePlugin（运行时）。

## BuildPlugin（构建时）

运行在 Node.js 环境，在 Vite 构建过程中执行。

```typescript
import type { BuildPlugin } from 'deer-mobile';

const myPlugin: BuildPlugin = (api) => {
  // 修改应用配置
  api.modifyConfig((config) => ({
    ...config,
    title: config.title + '!',
  }));

  // 修改路由表
  api.modifyRoutes((routes) => {
    routes.push({ path: '/custom', file: '/src/pages/custom.tsx' });
    return routes;
  });

  // 代码生成前回调
  api.onGenerate((gen) => {
    gen.addEntryCode(`console.log('App started!');`);
  });
};
```

### BuildAPI 完整参考

| API | 说明 |
|-----|------|
| `modifyConfig(fn)` | 修改 AppConfig |
| `modifyRoutes(fn)` | 修改路由表 |
| `onInit(fn)` | 插件初始化 |
| `onGenerate(fn)` | 代码生成前 |
| `onBuildComplete(fn)` | 构建完成 |
| `addRuntimePlugin(plugin)` | 注册运行时插件 |
| `addEntryCode(code)` | 注入代码 |
| `addImport(specifier, source)` | 注入 import |
| `addHTMLScript(script)` | 注入 HTML script |
| `registerMethod(name, fn)` | 注册插件间通信方法 |
| `callMethod(name, ...args)` | 调用其他插件方法 |

## RuntimePlugin（运行时）

运行在浏览器环境，通过生命周期钩子介入应用。

```typescript
import type { RuntimePlugin, RuntimeContext } from 'deer-mobile';

const myPlugin: RuntimePlugin = {
  name: 'my-plugin',
  priority: 10,

  onAppCreated(app, ctx) {
    console.log('App created', ctx.config);
  },

  onRouterCreated(router, ctx) {
    router.beforeEach((to, from, next) => {
      console.log('Navigating to:', to.path);
      next();
    });
  },

  outerProvider(container) {
    // 包裹根组件
    return h('div', { id: 'my-wrapper' }, container());
  },
};
```

### 生命周期执行顺序

```
1. outerProvider      ← 最外层 Provider
2. onAppCreated       ← App 实例创建
3. onRouterCreated    ← Router 实例创建
4. rootContainer      ← 根组件包裹
5. innerProvider      ← 内层 Provider
6. onBeforeMount      ← 挂载前
7. onMounted          ← 挂载完成
8. onRouteChange      ← 路由变更
9. onPageEnter        ← 进入页面
10. onPageLeave       ← 离开页面
11. onError           ← 错误捕获
```

## 在 deer() 中使用

```typescript
deer({
  buildPlugins: [myBuildPlugin],
  runtimePlugins: [myRuntimePlugin],
});
```
