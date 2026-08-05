# 配置

## deer() 选项

框架的唯一入口是 `deer()` 函数，它接受以下选项：

```typescript
interface DeerOptions {
  // 应用配置
  config?: Partial<AppConfig>;

  // 环境变量声明
  env?: Record<string, string>;

  // 是否自动暴露 VITE_ 前缀变量（默认 true）
  envFallback?: boolean;

  // 路由配置
  routes?: { pluginRoutes?: RouteConfig[] };

  // Mock 配置
  mock?: MockPluginOptions;

  // 插件系统
  presets?: BuildPlugin[] | ((api: any) => void)[];
  buildPlugins?: BuildPlugin[];
  runtimePlugins?: RuntimePlugin[];

  // 回调语法糖
  modifyRoutes?: (routes: RouteConfig[]) => RouteConfig[] | void;
  modifyConfig?: (config: AppConfig) => AppConfig | void;
  onGenerate?: (api: GenerateAPI) => void | Promise<void>;
}
```

## AppConfig 完整字段

```typescript
interface AppConfig {
  title: string;           // 应用标题
  description: string;     // 应用描述
  author: string;          // 作者
  base: string;            // 基础路径（默认 '/'）
  theme: {                 // 主题
    primaryColor: string;  // 主色
    darkMode: boolean;     // 暗黑模式
  };
  layout: 'side' | 'top' | 'mix';  // 默认布局
  noNavPages: string[];    // 无导航栏页面
  request: { baseURL: string };    // HTTP 基础路径
  sm4Key?: string;         // SM4 加密密钥
  i18n?: { ... };          // 国际化配置
  mock?: { ... };          // Mock 配置
  loading?: { ... };       // 全局加载动画
  vconsole?: { ... };      // vConsole 调试面板（见下方章节）
  env: Record<string, string>;     // 环境变量
}
```

## 完整示例

```typescript
import { defineConfig } from 'vite';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { deer } from 'deer-mobile';

export default defineConfig({
  plugins: [
    VueJsx(),
    deer({
      config: {
        title: 'My App',
        author: 'developer',
        theme: { primaryColor: '#1890ff', darkMode: false },
        layout: 'top',
        request: { baseURL: '/api' },
        loading: { mode: 'top', color: '#1890ff' },
        vconsole: { enabled: 'auto' },
      },
      env: {
        apiBaseUrl: 'VITE_API_BASE_URL',
        appVersion: 'VITE_APP_VERSION',
      },
      runtimePlugins: [
        // 可选运行时插件
      ],
    }),
  ],
});
```

## vConsole 调试面板

deer-mobile 内置 vConsole 移动端调试面板（RuntimePlugin `deer:vconsole`），**默认注册、零配置开箱即用**。开发者可在真机/微信内置浏览器中查看 console、网络请求、元素、Storage 等信息。

> 依赖说明：vconsole 是 **optional peerDependency**。
> - 用 `create-deer-mobile` 脚手架生成的项目已自动安装，无需手动操作；
> - 已有项目手动接入 deer-mobile 时，需先 `npm install vconsole` 一次。

### 启用策略

通过 `config.vconsole.enabled` 控制：

```typescript
vconsole: {
  // 'auto'（默认）: dev 环境自动启用；生产环境通过 URL 参数按需打开
  // 'always': 任何环境都启用（测试包 / 预发体验包）
  // 'off'   : 完全禁用（URL 参数也不生效）
  // true    : 等价于 'always'
  // false   : 等价于 'off'
  enabled: 'auto',
}
```

### URL 参数按需打开

生产/测试包中，访问带参数即可临时打开 vConsole（无需重新打包）：

```
https://your-app.com/?vconsole=1
https://your-app.com/?vconsole=true
```

可通过 `urlParam` 自定义参数名，或 `urlToggle: false` 关闭该能力。

### 完整配置项

```typescript
vconsole: {
  enabled?: boolean | 'auto' | 'always' | 'off';  // 启用策略（默认 'auto'）
  urlToggle?: boolean;                             // 允许 URL 参数强制打开（默认 true）
  urlParam?: string;                               // URL 参数名（默认 'vconsole'）
  options?: {                                      // 透传给 VConsole 构造器
    theme?: 'dark' | 'light';                      // 主题
    maxLogNumber?: number;                         // 日志最大条数
    // ... 其它 vConsole 配置
  },
}
```

### 运行时手动开关

初始化后可通过全局 API 手动控制（需先启用 vConsole）：

```typescript
window.__DEER_VCONSOLE__?.show();      // 显示面板
window.__DEER_VCONSOLE__?.hide();      // 隐藏面板
window.__DEER_VCONSOLE__?.destroy();   // 销毁实例
```

### 实现说明

- 使用动态 `import('vconsole')` **按需加载**：dev 环境经 `import.meta.env.DEV` 静态替换实现 tree-shaking，生产构建默认不打包 vConsole；仅在 URL 参数触发时才加载，对线上零影响。
- 面板初始化时机为应用挂载完成（`onMounted` 钩子），避免影响首屏渲染。
