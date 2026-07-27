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
