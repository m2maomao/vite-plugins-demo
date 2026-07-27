# 文档站点方案

> **最后更新**: 2026-07-27 | 状态: 规划中

---

## 一、各包分析

| 包 | 当前文档 | 是否需独立文档站 | 理由 |
|----|---------|----------------|------|
| **kangaroo-mobile** | Playground（组件Demo） | ❌ 不需要 | Playground 已覆盖组件演示，用户看得见效果 |
| **deer-mobile** | 仅发布指引 | ✅ **需要** | 框架核心API、插件系统、配置需系统化文档 |
| **create-deer-mobile** | 仅发布指引 | ❌ 不需要 | CLI 工具，README 足够 |

---

## 二、大厂 Monorepo 文档架构调研

| 项目 | 文档位置 | 工具 | 是否独立 |
|------|---------|------|---------|
| **Vue 3** | `packages/docs/` | VitePress | 否，在 monorepo 内 |
| **Vite** | `docs/`（根目录） | VitePress | 否，在 monorepo 内 |
| **Nuxt 3** | `docs/`（根目录） | Docus | 否，在 monorepo 内 |
| **Next.js** | `docs/`（根目录） | Nextra | 否，在 monorepo 内 |
| **Turborepo** | `docs/`（根目录） | Nextra | 否，在 monorepo 内 |
| **Umi 4** | 独立仓库 | Dumi | **是**，独立站点 |
| **React** | 独立仓库 | 自研 | **是**，独立站点 |

### 核心规律

1. **绝大多数**在 monorepo 内建文档站（`docs/` 或 `apps/docs/`）
2. **不是**包的子目录，而是**平级**的独立目录
3. 文档站**不随 npm 包发布**，用户看不到
4. 文档站独立构建，部署到 GitHub Pages / Vercel

---

## 三、推荐方案：根目录 `docs/` + VitePress

### 3.1 目录结构

```
docs/                          # ← 文档站根目录（不随包发布）
├── .vitepress/
│   ├── config.ts              # VitePress 配置（主题、侧边栏、导航）
│   └── theme/
│       └── custom.css         # 自定义样式
├── public/
│   └── logo.svg               # 站点 Logo
├── guide/
│   ├── index.md               # 简介：什么是 Deer Mobile
│   ├── getting-started.md     # 快速开始：安装 + 最小示例
│   ├── configuration.md       # 配置：deer() 选项 + AppConfig
│   ├── routing.md             # 路由：约定式路由 + 动态路由 + 路由元数据
│   ├── layout.md              # 布局：LayoutResolver + 嵌套布局
│   ├── plugin-system.md       # 插件系统：BuildPlugin + RuntimePlugin
│   ├── http-client.md         # HTTP 封装：axios + 拦截器 + 加密
│   ├── auth.md                # 鉴权：路由守卫 + Token 管理
│   ├── state-management.md    # 状态管理：Pinia + persistedstate
│   ├── i18n.md                # 国际化：vue-i18n 集成
│   ├── env.md                 # 环境变量：.env 文件管理
│   ├── pwa.md                 # PWA 离线访问
│   └── deployment.md          # 部署指南
├── api/
│   ├── deer.md                # deer() API 参考
│   ├── app-config.md          # AppConfig 字段说明
│   ├── build-plugin.md        # BuildPlugin API
│   └── runtime-plugin.md      # RuntimePlugin API
├── examples/                  # 示例代码
│   ├── basic-setup.md
│   └── custom-plugin.md
└── index.md                   # 首页
```

### 3.2 数据流

```
┌─────────────────────────────────────────────────┐
│              部署平台（Vercel / GitHub Pages）      │
│    https://deer-mobile.dev                       │
└──────────────────┬──────────────────────────────┘
                   │ pnpm build:docs
┌──────────────────▼──────────────────────────────┐
│              docs/ 目录                            │
│   deer-mobile/                                    │
│   ├── docs/          ← VitePress 源码              │
│   ├── packages/      ← 引用源码做 API 文档          │
│   └── package.json   ← 含 vitepress 依赖           │
└─────────────────────────────────────────────────┘
                   │
                   │ 不随 npm 发布
                   ▼
       用户安装 deer-mobile 时
       只会得到 packages/deer-mobile/
       看不到 docs/ 目录
```

### 3.3 技术选型

**推荐 VitePress** 的理由：

1. **Vite 8 原生兼容** — 项目已用 Vite 8，生态一致
2. **Markdown 写文档** — 低门槛，关注内容而非样式
3. **MD 扩展** — 代码高亮、自定义容器、Frontmatter 开箱即用
4. **TypeScript 支持** — 配置文件中写 TS
5. **Vue 组件嵌入** — 可引用 deer-mobile 的组件做交互式示例
6. **搜索** — 内置全文搜索，无需额外配置
7. **流行度** — Vue 3 / Vite / Pinia 等官方都在用

### 3.4 构建与部署

```json
// 根 package.json 追加脚本
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

```yaml
# .github/workflows/docs.yml（可选）
name: Deploy Docs
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm docs:build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

---

## 四、不推荐的做法

### ❌ 在包内建文档（如 packages/deer-mobile/docs/）

```
packages/deer-mobile/
├── docs/          ← ❌ 会被 npm publish 携带
├── src/
└── package.json
```

- `npm publish` 默认会发布 `docs/`
- 用户项目里多出无用的文档目录
- 可通过 `.npmignore` 排除，但增加了维护成本

### ❌ 每个包单独写文档站

```
packages/deer-mobile/docs/     ← ❌
packages/kangaroo-mobile/docs/ ← ❌
```

- 用户需要访问多个站点
- 内容割裂，没有统一的框架视角
- 维护成本翻倍

---

## 五、实施步骤

### Step 1: 安装 VitePress

```bash
pnpm add -D -w vitepress
```

### Step 2: 初始化文档结构

- 创建 `docs/` 目录
- 配置 `docs/.vitepress/config.ts`
- 创建首页 `docs/index.md`

### Step 3: 编写核心文档

按优先级：
1. 首页 + 快速开始（用户第一眼看到的）
2. 配置说明（最常用的）
3. 路由 + 布局（核心功能）
4. 插件系统（进阶功能）
5. 其他（HTTP / Auth / i18n / Env / PWA）

### Step 4: 更新 README

- `packages/deer-mobile/README.md` → 指向文档站
- `packages/create-deer-mobile/README.md` → 完善 CLI 使用说明
- `packages/kangaroo-mobile/README.md` → 指向 Playground

### Step 5: 更新 `framework-comparison.md`

- 将「文档站点」从缺失功能移至已完成功能
