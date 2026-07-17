# Vite Plugins Demo

基于 Vite 插件体系的移动端框架 Monorepo 项目。

## 目录结构

```
vite-plugs-demo/
├── package.json                 # 根目录：只管理工具链（TypeScript, ESLint）
├── turbo.json                   # Turborepo 构建管线配置
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── tsconfig.json                # TypeScript 基础配置（子包继承）
├── eslint.config.js             # ESLint 配置
├── .gitignore
├── README.md
│
├── packages/                    # 发布的 npm 包
│   ├── deer-mobile/             # 移动端框架（Vite 插件集 + 布局 + stores）
│   ├── kangaroo-mobile/         # UI 组件库（Vue 组件）
│   └── create-deer-mobile/      # 脚手架工具（pnpm create deer-mobile）
│
├── apps/
│   └── example/                 # Demo 应用
│       ├── package.json         # 应用依赖（vue, pinia, deer-mobile...）
│       ├── vite.config.ts       # Vite 配置（使用 deer-mobile 的插件）
│       ├── index.html
│       ├── src/
│       │   ├── main.tsx         # 应用入口
│       │   ├── style.css        # Tailwind CSS 样式
│       │   ├── api/user.ts      # API 接口定义
│       │   ├── composables/     # Vue composables
│       │   ├── pages/           # 页面组件（文件路由）
│       │   └── virtual-modules.d.ts  # 虚拟模块类型声明
│       ├── plugins/             # Demo 专用 Vite 插件
│       │   ├── hello-plugin.ts
│       │   ├── timestamp-plugin.ts
│       │   ├── greeting-plugin.ts
│       │   └── logger-plugin.ts
│       ├── server/              # Express 后端
│       └── public/
│
└── plans/                       # 设计文档 / 架构决策
```

## 三个发布包

| 包 | 路径 | 说明 |
|---|------|------|
| `deer-mobile` | [`packages/deer-mobile`](packages/deer-mobile) | 移动端框架。提供 Vite 插件（配置、路由、API、认证、Pinia 等）、布局组件、stores、工具函数 |
| `kangaroo-mobile` | [`packages/kangaroo-mobile`](packages/kangaroo-mobile) | UI 组件库。Button、Cell、Form、Toast 等 20+ 移动端组件 |
| `create-deer-mobile` | [`packages/create-deer-mobile`](packages/create-deer-mobile) | 脚手架。`pnpm create deer-mobile` 快速创建项目 |

## Demo 应用

[`apps/example`](apps/example) 是一个完整的前后端 demo，用于开发和调试 deer-mobile。

### 功能特性

- **文件路由**：`src/pages/` 下的文件自动生成路由
- **API 自动注入**：`src/api/` 下的接口自动注册为 `$api`
- **内置页面**：登录、404、加载中、Pinia 演示
- **路由守卫**：未登录自动跳转登录页
- **Pinia 状态管理**：用户认证状态自动持久化（localStorage）
- **Tailwind CSS v4**：原子化样式方案
- **服务端路由**：支持从后端动态加载路由

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动 dev server（默认 http://localhost:5173）
pnpm dev

# 构建（Turborepo 自动按依赖顺序执行）
pnpm build
# 1. deer-mobile:build → 重建 index.js（入口文件）
# 2. kangaroo-mobile:build → 构建组件库
# 3. example:build → 构建 demo 应用

# 预览构建产物
pnpm preview

# 启动后端 API server（端口 3001）
pnpm server
```

## Turborepo 构建管线

[`turbo.json`](turbo.json) 定义了构建任务的依赖关系：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "index.js"]
    }
  }
}
```

- **自动并行**：无依赖关系的包并行构建（如 deer-mobile 和 kangaroo-mobile）
- **缓存加速**：未变动的包跳过构建，第二次构建毫秒级完成
- **按需构建**：只改动 deer-mobile 时，仅重建 deer-mobile → example

## 技术栈

- **Monorepo**: pnpm workspace
- **构建**: Vite 8 + Rolldown
- **框架**: Vue 3 + Vue Router 4 + Pinia
- **样式**: Tailwind CSS v4
- **语言**: TypeScript + JSX
- **后端**: Express
