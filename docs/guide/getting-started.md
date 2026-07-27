# 快速开始

## 安装

```bash
# 使用 CLI 创建新项目
npx create-deer-mobile my-app
cd my-app
pnpm install
pnpm dev
```

## 手动集成

在现有 Vite 项目中安装：

```bash
pnpm add deer-mobile
```

## 最小配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { deer } from 'deer-mobile';

export default defineConfig({
  plugins: [
    vueJsx(),
    deer({
      config: {
        title: 'My App',
      },
    }),
  ],
});
```

## 目录结构

```
src/
├── pages/          # 页面文件（约定式路由）
│   ├── index.tsx          → /
│   ├── about.tsx          → /about
│   └── user/
│       ├── index.tsx      → /user
│       └── [id].tsx       → /user/:id
├── layouts/        # 布局组件（自动扫描）
│   ├── default.tsx
│   └── user.tsx
├── api/            # API 模块（自动注入）
│   └── user.ts
├── stores/         # Pinia 状态
│   └── userStore.ts
├── mock/           # Mock 数据
│   └── user.json
├── main.ts         # 入口文件
└── style.css       # 全局样式
```

## 启动

```bash
pnpm dev      # 开发模式
pnpm build    # 生产构建
pnpm preview  # 预览构建结果
```
