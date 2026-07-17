# Monorepo 依赖管理：Peer Dependencies 的三种模式

以你的项目为例，`deer-mobile` 声明了 peerDependencies：

```json
// packages/deer-mobile/package.json
"peerDependencies": {
  "vue": "^3.5.0",
  "vue-router": "^4.0.0",
  "pinia": "^3.0.0",
  "pinia-plugin-persistedstate": "^4.0.0",
  "axios": "^1.0.0",
  "@vueuse/core": "^14.0.0",
}
```

消费者（demo 应用）需要安装这些依赖。关键问题是：**消费者是谁？**

## 三种模式

### 模式 A：根目录即应用（你当前的模式）

```
vite-plugs-demo/
├── package.json          ← dependencies: vue, pinia, ...（消费者）
├── src/                  ← demo 应用代码
├── vite.config.ts
└── packages/deer-mobile/ ← peerDependencies 声明
```

**根目录同时扮演两个角色**：
1. pnpm workspace 的根
2. demo 应用（消费者）

所以 `pinia` 在根目录的 `dependencies` 里是完全正确的——它和 `vue`、`vue-router`、`axios` 一样，都是 demo 应用需要的运行时依赖。

**实际例子**：Vue 核心团队自己的 [vitest](https://github.com/vitest-dev/vitest) monorepo 就是这种模式，根目录同时是 playground。

### 模式 B：独立 demo 包（Nx/Turborepo 风格）

```
vite-plugs-demo/
├── package.json          ← 只有 devDependencies（工具链）
├── apps/demo/
│   ├── package.json      ← dependencies: vue, pinia, ...（消费者）
│   ├── src/
│   └── vite.config.ts
└── packages/deer-mobile/
```

**优点**：
- 根目录保持纯净，只管理 workspace 工具链（TypeScript、ESLint 等）
- 职责清晰：`apps/demo` 是应用，`packages/deer-mobile` 是框架

**缺点**：
- 需要配置 workspace script（如 `pnpm --filter demo dev`）
- 多了目录层级，小项目反而增加复杂度

**实际例子**：Vue 3 源码就是这种模式，`packages/vue` 发布，`apps/` 下放 playground。

### 模式 C：pnpm 自动 hoist（不推荐）

```json
// packages/deer-mobile/package.json
"dependencies": {
  "pinia": "^3.0.0"  // 直接放 dependencies 而不是 peer
}
```

这样 pnpm 会把它 hoist 到根目录 `node_modules`，demo 应用也能用。但：

**不推荐的原因**：
- `pinia` 会被打包进 `deer-mobile` 的 bundle（如果它是 dependencies）
- 用户项目可能安装不同版本的 pinia，造成冲突
- 违背了 peerDependencies 的设计意图

## 结论

```
你当前的模式（A）在大厂中很常见，没有问题。
```

根目录 `package.json` 的 dependencies：

| 依赖 | 属于 | 理由 |
|------|------|------|
| `vue`, `vue-router` | ✅ 应在根目录 | 使用 deer-mobile 需要安装 |
| `pinia` | ✅ 应在根目录 | 同上，消费者安装 |
| `pinia-plugin-persistedstate` | ✅ 应在根目录 | 同上 |
| `axios`, `@vueuse/core` | ✅ 已在根目录 | 同上 |

**它们不是「安装了两套」**，而是：
- `deer-mobile` 声明「我需要这些，版本要 ^x.x.x」
- 根目录安装「好的，我来装，版本是 x.x.x」

一个声明约束，一个实际安装，各司其职。

## 如果你想要更清晰的结构

可以考虑以后把 demo 移到一个独立包中：

```
packages/demo/          ← 新建 demo 包
packages/deer-mobile/
packages/kangaroo-mobile/
packages/create-deer-mobile/
```

根目录 `package.json` 回归纯工具链，demo 的依赖由 `packages/demo/package.json` 管理。但这属于架构重构，不是必选项。
