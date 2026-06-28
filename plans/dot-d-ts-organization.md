# `.d.ts` 文件的组织方式

## 风格一：集中式（适合小项目）

一个文件管所有，放在 `src/` 根目录下，通常是 `src/env.d.ts` 或 `src/vite-env.d.ts`。

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

declare module 'virtual:greeting' {
  export const greeting: string
  export const version: string
  export function getTime(): string
}

declare module 'virtual:routes' {
  export const routes: RouteRecord[]
}
```

优点：简单直接，项目小的时候很方便

## 风格二：分散式（适合中大型项目）

按功能拆到 `src/types/` 目录下，每个模块一个文件。

```
src/
├── types/
│   ├── env.d.ts              # Vite 环境变量类型
│   ├── virtual-greeting.d.ts  # virtual:greeting 声明
│   └── virtual-routes.d.ts    # virtual:routes 声明
├── main.ts
└── ...
```

每个文件内容只声明一个模块：

```typescript
// src/types/virtual-greeting.d.ts
declare module 'virtual:greeting' {
  export const greeting: string
  export const version: string
  export function getTime(): string
}
```

优点：职责清晰，多人协作时冲突少

## 推荐

- **自己写插件Demo** → 风格一，一个 `env.d.ts` 搞定
- **正式发布插件** → 插件自带 `.d.ts` 文件，通过 `package.json` 的 `types` 字段暴露，用户安装插件后自动获得类型提示
