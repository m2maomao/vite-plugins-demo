# deer()

框架唯一入口函数，返回 Vite 插件。

## 类型

```typescript
function deer(options?: DeerOptions): Plugin;
```

## 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `config` | `Partial<AppConfig>` | `{}` | 应用配置 |
| `env` | `Record<string, string>` | `{}` | 环境变量声明 |
| `envFallback` | `boolean` | `true` | 自动暴露 VITE_ 变量 |
| `routes` | `{ pluginRoutes? }` | - | 路由配置 |
| `mock` | `MockPluginOptions` | - | Mock 配置 |
| `presets` | `BuildPlugin[]` | `[]` | 预设插件集 |
| `buildPlugins` | `BuildPlugin[]` | `[]` | 构建时插件 |
| `runtimePlugins` | `RuntimePlugin[]` | `[]` | 运行时插件 |
| `modifyRoutes` | `Function` | - | 修改路由回调 |
| `modifyConfig` | `Function` | - | 修改配置回调 |
| `onGenerate` | `Function` | - | 生成回调 |

## 示例

```typescript
import { deer } from 'deer-mobile';

deer({
  config: {
    title: 'My App',
    theme: { primaryColor: '#1890ff', darkMode: false },
  },
  runtimePlugins: [
    { name: 'my-plugin', onAppCreated: (app) => console.log('ready') },
  ],
})
```
