# 🚀 Vite 插件开发入门教程（TypeScript 版）

> 从空目录开始，用 **TypeScript** 手把手教你写出第一个 Vite 插件

---

## 目录

- [🚀 Vite 插件开发入门教程（TypeScript 版）](#-vite-插件开发入门教程typescript-版)
  - [目录](#目录)
  - [Step 0：准备工作](#step-0准备工作)
  - [Step 1：创建一个 TypeScript + Vite 项目](#step-1创建一个-typescript--vite-项目)
  - [Step 2：第一个插件——最简单的日志输出](#step-2第一个插件最简单的日志输出)
    - [2.1 创建插件目录和文件](#21-创建插件目录和文件)
    - [2.2 在配置中引入](#22-在配置中引入)
    - [2.3 运行测试](#23-运行测试)
  - [Step 3：最实用的钩子——transform](#step-3最实用的钩子transform)
  - [Step 4：虚拟模块](#step-4虚拟模块)
  - [Step 5：插件接收参数](#step-5插件接收参数)
  - [总结与下一步](#总结与下一步)
    - [你现在已经学会了](#你现在已经学会了)
    - [最终项目目录结构](#最终项目目录结构)
    - [关键 TypeScript 类型速查](#关键-typescript-类型速查)
    - [接下来可以探索](#接下来可以探索)

---

## Step 0：准备工作

确保你的电脑上已安装：

- [Node.js](https://nodejs.org/)（建议 v18 或更高版本）
- npm（Node.js 自带）或 yarn 或 pnpm

在终端检查：

```bash
node -v   # 查看 Node 版本，应 ≥ 18
npm -v    # 查看 npm 版本
```

---

## Step 1：创建一个 TypeScript + Vite 项目

> 要开发 TypeScript 插件，你需要一个支持 TypeScript 的 Vite 项目。

在当前的 [`vite-plugs-demo`](.) 目录中创建项目：

```bash
npm create vite@latest . -- --template vanilla-ts
```

这个命令会：
- 在当前目录创建 Vite 项目
- `--template vanilla-ts` 表示使用 TypeScript 的纯 JS 项目模板

> 如果提示目录非空，可以往上退一级重新创建，再把内容移回来：
> ```bash
> cd ..
> npm create vite@latest vite-plugs-demo -- --template vanilla-ts
> cd vite-plugs-demo
> ```

安装依赖：

```bash
npm install
```

额外安装 Vite 的类型定义（写插件时会有类型提示）：

```bash
npm install -D @types/node
```

启动开发服务器看看效果：

```bash
npm run dev
```

浏览器打开终端提示的地址（通常是 `http://localhost:5173`），你应该能看到 Vite 的默认页面。

✅ **Step 1 完成！**

---

## Step 2：第一个插件——最简单的日志输出

### 2.1 创建插件目录和文件

```bash
mkdir plugins
```

新建 [`plugins/hello-plugin.ts`](plugins/hello-plugin.ts)：

```typescript
// plugins/hello-plugin.ts
import type { Plugin } from 'vite'

export default function helloPlugin(): Plugin {
  return {
    name: 'hello-plugin',

    buildStart() {
      console.log('👋 Hello！这是用 TypeScript 写的 Vite 插件！')
    },

    buildEnd() {
      console.log('👋 构建结束，再见！')
    }
  }
}
```

> 注意：插件函数的返回类型标注为 `Plugin`，这是 Vite 提供的类型，能让你在写钩子时获得智能提示。

### 2.2 在配置中引入

打开 [`vite.config.ts`](vite.config.ts)，修改为：

```typescript
import { defineConfig } from 'vite'
import helloPlugin from './plugins/hello-plugin'

export default defineConfig({
  plugins: [
    helloPlugin()
  ]
})
```

### 2.3 运行测试

```bash
npm run build
```

终端会输出：

```
👋 Hello！这是用 TypeScript 写的 Vite 插件！
...
👋 构建结束，再见！
```

✅ **Step 2 完成！** 你已经用 TypeScript 写了一个独立文件的 Vite 插件。

---

## Step 3：最实用的钩子——transform

> `transform` 是 Vite 插件**最核心、最常用**的钩子。它在每个模块加载时被调用，让你可以修改模块的源代码。

新建 [`plugins/timestamp-plugin.ts`](plugins/timestamp-plugin.ts)：

```typescript
// plugins/timestamp-plugin.ts
import type { Plugin } from 'vite'

export default function timestampPlugin(): Plugin {
  return {
    name: 'timestamp-plugin',

    transform(code, id) {
      // id: 文件的绝对路径
      // code: 文件的源代码

      // 只处理 src 目录下的 .ts 文件
      if (id.includes('/src/') && (id.endsWith('.ts') || id.endsWith('.js'))) {
        const now = new Date().toLocaleString()
        console.log(`📝 处理文件: ${id.replace(process.cwd(), '')}`)

        return {
          code: `// ⏰ 构建时间: ${now}\n${code}`,
          map: null // 不生成 sourcemap
        }
      }

      // 返回 null 或 undefined 表示不处理此模块
    }
  }
}
```

在 [`vite.config.ts`](vite.config.ts) 中引入：

```typescript
import { defineConfig } from 'vite'
import helloPlugin from './plugins/hello-plugin'
import timestampPlugin from './plugins/timestamp-plugin'

export default defineConfig({
  plugins: [
    helloPlugin(),
    timestampPlugin()
  ]
})
```

运行 `npm run build`，然后打开 `dist/assets/` 下的 JS 文件看看——顶部应该有一行时间戳注释。

✅ **Step 3 完成！** 你学会了最实用的 `transform` 钩子。

---

## Step 4：虚拟模块

> 虚拟模块让你可以**不创建实际文件**，就能生成可供 `import` 的模块内容。

新建 [`plugins/greeting-plugin.ts`](plugins/greeting-plugin.ts)：

```typescript
// plugins/greeting-plugin.ts
import type { Plugin } from 'vite'

// 虚拟模块的 ID（使用者 import 时用的路径）
const VIRTUAL_MODULE_ID = 'virtual:greeting'
// Vite 内部解析后的 ID（加 \0 前缀标识这是一个虚拟模块）
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID

export default function greetingPlugin(): Plugin {
  return {
    name: 'greeting-plugin',

    // 当遇到 import 'virtual:greeting' 时，告诉 Vite 这是由我们处理的
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_ID
      }
      return null
    },

    // Vite 根据 resolveId 返回的 ID 来请求模块内容
    load(id) {
      if (id === RESOLVED_ID) {
        return `
          export const greeting: string = '你好！这是虚拟模块！'
          export const version: string = '1.0.0'
          export function getTime(): string {
            return new Date().toLocaleString()
          }
        `
      }
      return null
    }
  }
}
```

在 [`vite.config.ts`](vite.config.ts) 中引入：

```typescript
import { defineConfig } from 'vite'
import helloPlugin from './plugins/hello-plugin'
import timestampPlugin from './plugins/timestamp-plugin'
import greetingPlugin from './plugins/greeting-plugin'

export default defineConfig({
  plugins: [
    helloPlugin(),
    timestampPlugin(),
    greetingPlugin()
  ]
})
```

然后在 [`src/main.ts`](src/main.ts) 中引入虚拟模块来测试：

```typescript
// src/main.ts
import { greeting, version, getTime } from 'virtual:greeting'
import './style.css'
import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter.ts'

console.log(greeting)       // 输出: 你好！这是虚拟模块！
console.log('版本:', version)
console.log('当前时间:', getTime())

// ... 下面是模板原有的代码 ...
```

运行 `npm run dev`，打开浏览器控制台，你应该能看到来自虚拟模块的输出。

✅ **Step 4 完成！** 你学会了虚拟模块技术。

---

## Step 5：插件接收参数

> 实际开发中，插件几乎都需要接收配置参数。

新建 [`plugins/logger-plugin.ts`](plugins/logger-plugin.ts)：

```typescript
// plugins/logger-plugin.ts
import type { Plugin, ResolvedConfig } from 'vite'

// 定义插件的配置参数类型
interface LoggerPluginOptions {
  prefix?: string
  showFileList?: boolean
}

export default function loggerPlugin(options: LoggerPluginOptions = {}): Plugin {
  // 解构参数，设置默认值
  const {
    prefix = '🔧',
    showFileList = false
  } = options

  // 保存解析后的配置，供其他钩子使用
  let config: ResolvedConfig

  return {
    name: 'logger-plugin',

    // configResolved 在 Vite 配置完全解析后调用
    configResolved(resolvedConfig) {
      config = resolvedConfig
      console.log(`${prefix} 项目根目录: ${config.root}`)
      console.log(`${prefix} 命令模式: ${config.command}`)
    },

    transform(code, id) {
      if (showFileList && id.includes('/src/')) {
        console.log(`${prefix} 文件: ${id.replace(process.cwd(), '')}`)
      }
    },

    buildEnd() {
      console.log(`${prefix} 构建完成！共处理了 ${config ? '若干' : '未知'} 个文件`)
    }
  }
}
```

在 [`vite.config.ts`](vite.config.ts) 中使用：

```typescript
import { defineConfig } from 'vite'
import helloPlugin from './plugins/hello-plugin'
import timestampPlugin from './plugins/timestamp-plugin'
import greetingPlugin from './plugins/greeting-plugin'
import loggerPlugin from './plugins/logger-plugin'

export default defineConfig({
  plugins: [
    helloPlugin(),
    timestampPlugin(),
    greetingPlugin(),
    loggerPlugin({
      prefix: '📋',
      showFileList: true
    })
  ]
})
```

✅ **Step 5 完成！** 现在你的插件支持参数配置了。

---

## 总结与下一步

### 你现在已经学会了

| 技能 | 涉及钩子 | 文件 |
|------|---------|------|
| ✅ 用 TypeScript 写插件 | `buildStart` / `buildEnd` | [`plugins/hello-plugin.ts`](plugins/hello-plugin.ts) |
| ✅ 转换代码内容 | `transform` | [`plugins/timestamp-plugin.ts`](plugins/timestamp-plugin.ts) |
| ✅ 创建虚拟模块 | `resolveId` + `load` | [`plugins/greeting-plugin.ts`](plugins/greeting-plugin.ts) |
| ✅ 插件参数化 & 读取配置 | `configResolved` | [`plugins/logger-plugin.ts`](plugins/logger-plugin.ts) |

### 最终项目目录结构

```
vite-plugs-demo/
├── plugins/
│   ├── hello-plugin.ts          # Step 2: 基础日志插件
│   ├── timestamp-plugin.ts      # Step 3: transform 示例
│   ├── greeting-plugin.ts       # Step 4: 虚拟模块示例
│   └── logger-plugin.ts         # Step 5: 参数化插件
├── src/
│   ├── main.ts                  # 入口文件（可引入虚拟模块测试）
│   ├── counter.ts
│   ├── style.css
│   └── vite-env.d.ts
├── vite.config.ts               # Vite 配置
├── index.html
├── package.json
├── tsconfig.json
└── ...
```

### 关键 TypeScript 类型速查

```typescript
import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
```

| 类型 | 用途 |
|------|------|
| `Plugin` | 插件返回值类型（最常用） |
| `ResolvedConfig` | 解析后的 Vite 完整配置 |
| `UserConfig` | 用户原始配置（`config` 钩子的参数） |

### 接下来可以探索

1. [Vite 官方插件 API 文档](https://vite.dev/guide/api-plugin.html) — 完整钩子列表
2. [Rollup 插件钩子文档](https://rollupjs.org/plugin-development/) — Vite 底层使用 Rollup
3. 参考 Vite 官方的 TypeScript 插件实现，如 `@vitejs/plugin-vue`

---

> 🎉 恭喜完成了全部 5 个步骤！你现在可以用 TypeScript 独立开发 Vite 插件了。
> 打开编辑器，跟着 Step 1 开始操作即可。
