# 迁移到模式 B：独立应用包（apps/ 结构）

## 目标目录结构

```
vite-plugs-demo/
├── package.json              ← 只有 devDependencies（工具链）
├── pnpm-workspace.yaml       ← 新增 apps/*
├── tsconfig.json              ← 基础配置
├── eslint.config.js
├── .gitignore
├── README.md
├── plans/                     ← 设计文档
├── packages/                  ← 发布的包（不变）
│   ├── create-deer-mobile/
│   ├── deer-mobile/
│   └── kangaroo-mobile/
└── apps/
    └── example/               ← demo 应用
        ├── package.json       ← 自己的 dependencies
        ├── index.html
        ├── vite.config.ts
        ├── src/
        │   ├── main.tsx
        │   ├── style.css
        │   ├── api/
        │   ├── composables/
        │   ├── pages/
        │   └── virtual-modules.d.ts
        ├── plugins/            ← demo 专用插件
        │   ├── hello-plugin.ts
        │   ├── timestamp-plugin.ts
        │   ├── greeting-plugin.ts
        │   └── logger-plugin.ts
        ├── public/
        │   └── favicon.svg
        │   └── icons.svg
        └── server/
            └── index.ts
```

## 谁搬走，谁留下

### 留在根目录的（工具链）
| 文件 | 原因 |
|------|------|
| `package.json` | 只保留 `devDependencies`（TypeScript、ESLint、Vite 等） |
| `pnpm-workspace.yaml` | workspace 配置 |
| `tsconfig.json` | 作为基础配置，子包继承 |
| `eslint.config.js` | 统一的 lint 规则 |
| `.gitignore` | 仓库级忽略规则 |

### 搬到 `apps/example/` 的
| 文件 | 说明 |
|------|------|
| `index.html` | 应用的 HTML 入口 |
| `vite.config.ts` | demo 的构建配置 |
| `src/` | 全部应用代码 |
| `public/` | 静态资源 |
| `server/` | demo 的后端服务 |
| `plugins/hello-plugin.ts` 等 | demo 专用插件 |

### 新 `apps/example/package.json`
```json
{
  "name": "example",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "server": "npx tsx server/index.ts"
  },
  "dependencies": {
    "deer-mobile": "workspace:*",
    "kangaroo-mobile": "workspace:*",
    "vue": "^3.5.39",
    "vue-router": "^4.6.4",
    "pinia": "^3.0.0",
    "pinia-plugin-persistedstate": "^4.7.1",
    "axios": "^1.18.1",
    "@vueuse/core": "^14.3.0",
    "@tailwindcss/vite": "^4.3.1",
    "tailwindcss": "^4.3.1",
    "esbuild": "^0.28.1",
    "fast-glob": "^3.3.3"
  },
  "devDependencies": {
    "vite": "^8.1.0",
    "@vitejs/plugin-vue-jsx": "^5.1.6",
    "express": "^5.2.1",
    "@types/express": "^5.0.6"
  }
}
```

## 根目录 commands 的变化

```json
// 当前根目录 package.json scripts
"dev": "vite",
"build": "tsc && vite build",
"server": "npx tsx server/index.ts"

// 改为例子的命令（或其他你喜欢的命令名）
"scripts": {
  "dev": "pnpm --filter example dev",
  "build": "pnpm --filter example build",
  "server": "pnpm --filter example server",
  "lint": "eslint ."
}
```

## 这样做的好处

1. **根目录 package.json 只关注工具链**，干干净净
2. **依赖关系清晰**：`apps/example` 的依赖在自己 package.json 里
3. **易于扩展**：以后加 `apps/docs`、`apps/benchmark` 都方便
4. **专业感**：和 Vue 3、Vite、Turborepo 等项目结构一致

## 改动量评估

这次迁移主要是**文件搬家和路径调整**，不涉及逻辑修改，纯机械操作。
