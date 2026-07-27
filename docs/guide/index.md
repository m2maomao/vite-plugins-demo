# 简介

## Deer Mobile 是什么？

Deer Mobile 是一个**基于 Vite 的企业级移动端框架**，提供约定式路由、插件系统、布局系统、HTTP 封装、鉴权等开箱即用的能力。

### 核心特性

- **🚀 Vite 8 + Vue 3 + TypeScript 6**：全栈最新技术栈
- **📁 约定式路由**：`src/pages/` 目录自动扫描，支持 `[id].tsx` 动态路由
- **🧩 双插件系统**：BuildPlugin（构建时）+ RuntimePlugin（运行时）
- **🎨 多布局**：自动扫描 `src/layouts/`，支持嵌套布局链
- **🔐 企业级**：SM4 加解密、业务状态码、Loading 队列
- **🌐 i18n**：框架层 + UI 层双国际化

### 技术栈

| 技术 | 用途 |
|------|------|
| [Vite 8](https://vite.dev) | 构建工具 |
| [Vue 3](https://vuejs.org) | 前端框架 |
| [TypeScript 6](https://www.typescriptlang.org) | 类型系统 |
| [Vue Router 4](https://router.vuejs.org) | 路由 |
| [Pinia 3](https://pinia.vuejs.org) | 状态管理 |
| [axios](https://axios-http.com) | HTTP 客户端 |
| [kangaroo-mobile](../) | UI 组件库 |

### 架构概览

```
vite.config.ts
     │
     ▼
  deer({...})        ← 框架唯一入口
     │
     ├── BuildPlugin  ← 构建时（Node.js）
     │   ├── modifyConfig → AppConfig
     │   ├── modifyRoutes → 路由表
     │   └── onGenerate  → 代码生成
     │
     └── RuntimePlugin ← 运行时（浏览器）
         ├── onAppCreated / onRouterCreated
         ├── rootContainer / outerProvider
         └── onPageEnter / onRouteChange
```
