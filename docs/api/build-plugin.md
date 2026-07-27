# BuildPlugin API

构建时插件，运行在 Node.js 环境。

## 类型

```typescript
type BuildPlugin = (api: BuildAPI) => void | Promise<void>;
```

## BuildAPI

| API | 说明 |
|-----|------|
| `describe(descriptor)` | 插件描述 |
| `onInit(fn)` | 插件初始化 |
| `modifyConfig(fn)` | 修改 AppConfig |
| `modifyRoutes(fn)` | 修改路由表 |
| `onGenerate(fn)` | 代码生成前 |
| `onBuildComplete(fn)` | 构建完成 |
| `onDevCompileDone(fn)` | 开发编译完成 |
| `addRuntimePlugin(plugin)` | 注册运行时插件 |
| `addEntryCode(code)` | 注入代码到入口 |
| `addImport(specifier, source)` | 注入 import |
| `addHTMLScript(script)` | 注入 script 到 HTML |
| `addHTMLHeadScript(script)` | 注入到 head |
| `addBeforeMiddlewares(mw)` | 添加开发中间件 |
| `registerMethod(name, fn)` | 注册方法 |
| `callMethod(name, ...args)` | 调用方法 |
| `getConfig()` | 获取 AppConfig |
| `getRoutes()` | 获取路由表 |

## 示例

```typescript
const plugin: BuildPlugin = (api) => {
  api.modifyConfig((config) => ({
    ...config,
    title: `${config.title} v2`,
  }));
};
```
