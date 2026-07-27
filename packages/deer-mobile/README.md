# Deer Mobile

> 企业级移动端 Vite 框架

基于 Vite 8 + Vue 3 + TypeScript 6，提供约定式路由、插件系统、布局系统、HTTP 封装、鉴权等开箱即用的能力。

## 文档

👉 [完整文档](https://deer-mobile.dev)

## 快速开始

```bash
npx create-deer-mobile my-app
cd my-app
pnpm install
pnpm dev
```

## 手动集成

```bash
pnpm add deer-mobile
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { deer } from 'deer-mobile';

export default defineConfig({
  plugins: [
    vueJsx(),
    deer({ config: { title: 'My App' } }),
  ],
});
```

## 本地发布测试

```bash
# 1. 启动本地 npm 仓库
npm install -g verdaccio
verdaccio

# 2. 编译发布
cd packages/deer-mobile
pnpm build
npm version patch
npm publish --registry http://localhost:4873
```
