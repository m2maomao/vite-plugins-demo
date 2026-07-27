# RuntimePlugin API

运行时插件，运行在浏览器环境。

## 类型

```typescript
interface RuntimePlugin {
  name: string;
  priority?: number;  // 默认 10，越小越先执行

  // 应用生命周期
  onAppCreated?: (app: App, ctx: RuntimeContext) => void;
  onRouterCreated?: (router: Router, ctx: RuntimeContext) => void;
  onRouterReady?: (router: Router, ctx: RuntimeContext) => void;
  onBeforeMount?: (app: App, ctx: RuntimeContext) => void;
  onMounted?: (ctx: RuntimeContext) => void;

  // Provider
  rootContainer?: (container: () => VNode, ctx: RuntimeContext) => VNode | (() => VNode);
  innerProvider?: (container: () => VNode) => VNode;
  outerProvider?: (container: () => VNode) => VNode;

  // 页面生命周期
  onPageEnter?: (route: RouteLocationNormalized, ctx: RuntimeContext) => void;
  onPageLeave?: (route: RouteLocationNormalized, ctx: RuntimeContext) => void;
  onRouteChange?: (to: RouteLocationNormalized, from: RouteLocationNormalized, ctx: RuntimeContext) => void;

  // 路由
  patchRoutes?: (info: { routes: RouteRecordRaw[] }) => RouteRecordRaw[] | void;
  onHistoryChange?: (info: { location: Location; action: 'PUSH' | 'POP' | 'REPLACE' }) => void;

  // 错误处理
  onError?: (error: Error, ctx: RuntimeContext) => void;
}
```

## RuntimeContext

```typescript
interface RuntimeContext {
  app: App;
  router: Router;
  config: AppConfig;
  data: Map<string, unknown>;

  addRouterGuard(type, guard): void;
  addRoute(route): void;
  removeRoute(name): void;
  getRoutes(): RouteRecordNormalized[];
  addLayout(name, component): void;
  setLayout(name): void;
}
```

## 示例

```typescript
const plugin: RuntimePlugin = {
  name: 'analytics',
  priority: 5,
  onRouteChange(to, from) {
    console.log('Page view:', to.path);
  },
};
```
