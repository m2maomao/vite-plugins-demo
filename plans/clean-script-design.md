# clean/reset 脚本方案

## 大厂做法

| 项目 | 脚本 | 说明 |
|------|------|------|
| **Next.js** | `next clean` | 清除 `.next` 构建缓存 |
| **Nuxt 3** | `nuxi cleanup` | 清除 `.nuxt` + `node_modules/.cache` |
| **Turborepo** | `turbo clean` | 清除所有 `.turbo` 缓存 |
| **pnpm 官方** | `pnpm store prune` | 清除 store 中未引用的包 |

## 推荐方案

在根 `package.json` 添加两条脚本：

```json
{
  "scripts": {
    // clean: 清除所有构建产物和缓存
    "clean": "pnpm -r --parallel exec rm -rf dist node_modules .turbo && rm -rf node_modules pnpm-lock.yaml",

    // reset: 彻底重置后重新安装
    "reset": "pnpm clean && pnpm install"
  }
}
```

### 执行流程

```
pnpm clean
  ├── pnpm -r --parallel exec rm -rf dist
  │   ├── packages/deer-mobile/dist       ← 删除
  │   ├── packages/kangaroo-mobile/dist   ← 删除
  │   └── apps/example/dist               ← 删除
  ├── pnpm -r --parallel exec rm -rf node_modules
  │   ├── packages/*/node_modules         ← 删除
  │   └── apps/*/node_modules             ← 删除
  ├── pnpm -r --parallel exec rm -rf .turbo
  │   ├── packages/*/.turbo               ← 删除 Turbo 缓存
  │   └── apps/*/.turbo                   ← 删除
  ├── rm -rf node_modules                 ← 删除根 node_modules（含 .pnpm store）
  └── rm -rf pnpm-lock.yaml               ← 删除锁文件

pnpm reset = pnpm clean + pnpm install
```

### 使用场景

| 场景 | 命令 |
|------|------|
| 构建产物有问题，想重新构建 | `pnpm clean`（保留依赖）→ 然后 `pnpm build` 就行... 实际上 `pnpm clean` 会删 node_modules |
| 依赖有问题，想完全重置 | `pnpm reset` |
| 缓存导致奇怪的问题 | `pnpm clean`（会删 .turbo 缓存） |

等等，我仔细想了想——`clean` 如果连 node_modules 都删了，那每次跑还得重新 install，有点重。让我看看大厂更细的做法：

### 更精细的方案

```json
{
  "scripts": {
    // 轻量级：只删构建产物和缓存（保留 node_modules 和 lock）
    "clean": "pnpm -r --parallel exec rm -rf dist .turbo",

    // 重量级：删所有（node_modules + lock + 构建产物）
    "clean:all": "pnpm -r --parallel exec rm -rf dist node_modules .turbo && rm -rf node_modules pnpm-lock.yaml",

    // 彻底重置后重新安装
    "reset": "pnpm clean:all && pnpm install"
  }
}
```

这样：
- `pnpm clean` → 日常开发用，清构建产物（几十 KB），快
- `pnpm clean:all` → 依赖出问题时用，清所有
- `pnpm reset` → 一键重置重装

大部分时候只用 `pnpm clean`。
