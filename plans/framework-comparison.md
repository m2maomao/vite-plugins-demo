# Deer Mobile 框架状态与对比

> **最后更新**: 2026-07-24 | 核心框架完成度 ≈ **95%**

---

## 一、已完成功能 ✅

### `deer-mobile` 框架核心

| 模块 | 状态 | 实现方式 |
|------|------|---------|
| Vite 构建 | ✅ | Vite 8 + TypeScript 6 + rolldown 生产构建 |
| **插件系统 v5** | ✅ **已重构** | `deer()` 统一入口，BuildPlugin 8 生命周期 + RuntimePlugin 12 生命周期，替代旧 v4 config-plugin |
| **约定式路由** | ✅ **树形增强** | `src/pages/` 自动扫描，支持目录嵌套生成父子路由 |
| **动态路由** | ✅ | `[id].tsx` → `/user/:id` |
| **路由元数据** | ✅ | 页面 `export const routeMeta` 支持 title/layout/auth/transition/params/keepAlive |
| **路由参数校验** | ✅ | `routeMeta.params` 声明规则，`beforeEach` 校验 |
| **嵌套路由** | ✅ | 目录结构自动生成父子路由，child path 相对路径 |
| **多布局自动扫描** | ✅ | `src/layouts/*.tsx` 自动注册到 `virtual:layout-registry` |
| **布局系统** | ✅ **已增强** | LayoutResolver 调度器 + DefaultLayout / BlankLayout / TabBar / UserLayout + 嵌套布局链 + 布局插槽 + KeepAlive + 滚动恢复 |
| HTTP 封装 | ✅ | axios + 自动 token + 业务状态码拦截 + SM4 加解密 + Loading 队列 |
| API 自动扫描 | ✅ | 扫描 `src/api/` + DI 注入，带 `ApiModule<T>` 类型声明 |
| 鉴权系统 | ✅ | 路由守卫 + token 管理，支持 page-level `auth: false` |
| **内置页面** | ✅ **已修复** | login/404/error/loading 内联 `h()` 函数，消除路径依赖 |
| 代码注入 | ✅ | setup-plugin 自动生成 `virtual:setup-app` 启动代码 |
| **Mock API** | ✅ | 内置 `mockPlugin`，支持 `mock/` 目录自动扫描 + `apis` 参数配置 |
| 状态管理 | ✅ | pinia 3.x，`useUserStore` 开箱即用，persist 持久化 |
| 脚手架 CLI | ✅ | `create-deer-mobile` |
| **启动性能** | ✅ **已优化** | 并行 fetch 远程路由 + 静态 import 替代动态 import()，`router.isReady()` 从 1950ms 降至 ~20ms |
| 移动端适配 | ✅ | 运行时 rem 动态缩放，`setupFlexible()` 自动调用，375px 设计稿基准 |
| 业务状态码体系 | ✅ | 1xx 成功 / 2xx 告警 / 712/205/209 登录超时 / 110/112 Token 失效 |
| SM4 加解密 | ✅ **已修复** | `sm-crypto` optional 依赖，拦截器 async/await 确保加密完成再发送 |
| 国际化 i18n（框架层） | ✅ | vue-i18n 集成，`i18nPlugin` RuntimePlugin，语言切换自动同步 kangaroo-mobile |
| Tailwind CSS | ✅ | v4 集成 |
| `@vueuse/core` | ✅ | useStorage 响应式存储 |
| ESLint / Prettier | ✅ | 0 error 0 warning，lint-staged 自动格式化 |

### `kangaroo-mobile` UI 组件库

| 模块 | 状态 | 说明 |
|------|------|------|
| **图标系统** | ✅ | Iconify + Vant 兜底 + 本地 deer 自定义图标，`YhmIcon` 统一入口 |
| **国际化 i18n（UI 层）** | ✅ | Vant Locale 封装，`setLocale` / `createTranslate` / `i18nPlugin` |
| **主题系统** | ✅ | 品牌色 CSS 变量 + Vant 变量覆盖 + 暗黑模式 |
| **54 组件封装** | ✅ | 全部基于 Vant 4 二次封装，原 45 个 + 新增 9 个（PullRefresh / List / IndexBar / Sidebar / NumberKeyboard / PasswordInput / CountDown / Watermark / FloatingPanel） |
| **Demo 质量整改** | ✅ | 所有 demo 严格对齐 Vant 官方源码，slot 条件转发修复，Playground CSS Normalize 补齐 |
| **Playground** | ✅ | 组件 Demo 演示页面，含完整 CSS normalize 和动画类 |

#### 54 组件完整清单

| 分类 | 组件 |
|------|------|
| **导航** | NavBar, TabBar + TabbarItem, Tabs + Tab, Steps + Step, BackTop |
| **展示** | Cell + CellGroup, Card, Tag, Badge, Collapse + CollapseItem, Divider, Image, Loading, Empty, Skeleton + SkeletonImage + SkeletonParagraph |
| **反馈** | Toast, Dialog, Popup, ActionSheet, ImagePreview |
| **表单** | Button, Form + Field, Picker, TimePicker, Area, Calendar, Search, Switch, Stepper, Checkbox + CheckboxGroup, Radio + RadioGroup, Rate, Slider, Uploader |
| **基础** | Icon |
| **新增** | PullRefresh, List, IndexBar, Sidebar, NumberKeyboard, PasswordInput, CountDown, Watermark, FloatingPanel |

---

## 二、已修复的关键 Bug 🐛

| # | 问题 | 根因 | 修复 |
|---|------|------|------|
| 1 | builtin-plugin 路径错误 | 文件系统路径在打包后失效 | 内联为字符串 + `h()` 函数 |
| 2 | Loading 竞态条件 | 请求计数器在多请求下状态错乱 | 改用 `Set<string>` 追踪活跃请求 |
| 3 | SM4 加密未生效 | 拦截器未 await 加密完成 | 改为 `async/await` |
| 4 | API 无类型提示 | `ApiModule` 泛型缺失 | 添加类型声明文件 |
| 5 | `router.isReady()` 慢 | 动态 `import()` 导致 HTTP 瀑布 | 改为静态 import |
| 6 | scanPagesPlugin 重复扫描 | 每次 `load()` 都重新扫描文件系统 | 添加缓存 + `handleHotUpdate` 失效 |
| 7 | Slot 无条件转发 | `<slot />` 让 Vant 的 `slots.default` 始终为 truthy | 改用 `<template v-if #default>` 模式 |

---

## 三、缺失功能 ❌

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P1 | **运行时主题切换** | 动态切换 primaryColor/darkMode（`appConfig.theme` 已有配置字段但未实现运行时切换） |
| P2 | **单元测试** | vitest 测试框架，覆盖核心模块 |
| P2 | **组件测试** | @vue/test-utils，覆盖组件渲染 |
| P2 | **构建体积分析** | vite-plugin-inspect / rollup-plugin-visualizer |
| P2 | **CI/CD** | GitHub Actions 自动构建/发布 |
| P3 | 全局 Loading | 路由切换加载动画 |
| P3 | PWA | 离线访问 |
| P3 | 环境变量封装 | `.env` 文件管理封装 |
| P3 | 模板选择 | CLI 创建时选 TS/JS |
| P3 | 文档站点 | API 文档站点 |

---

## 四、与 Umi 4 能力对比

| 能力维度 | Umi 4 | Deer Mobile | 差距 |
|---------|-------|-------------|------|
| 构建时钩子 | 50+ | 8 | ⚠️ 中等 |
| 运行时钩子 | 20+ | 12 | ⚠️ 中等 |
| Provider 嵌套 | rootContainer | rootContainer + innerProvider + outerProvider | ✅ 对齐 |
| 约定式路由 | 文件系统 + 配置 | 文件系统 + 路由元数据 | ✅ 对齐 |
| 布局系统 | layout 插件 | LayoutResolver + 嵌套链 | ✅ 对齐 |
| 插件间通信 | plugin data | RuntimeContext.data | ✅ 对齐 |
| Mock | @umijs/plugin-mock | mockPlugin 中间件 | ✅ 对齐 |
| Preset 组合 | ✅ | ✅ | ✅ 对齐 |
| 插件市场/生态 | ✅ | ❌ | 🟡 远期中 |
| HMR 插件热更新 | ✅ | ❌ | 🟢 低优先级 |
| 插件间依赖声明 | ✅ (key deps) | ❌ | 🟢 低优先级 |

---

## 五、关键源码位置速查

| 功能模块 | 核心文件 | 关键代码 |
|---------|---------|---------|
| 框架入口 `deer()` | [`setup-plugin/index.ts`](../packages/deer-mobile/plugins/setup-plugin/index.ts) | 唯一 Vite 插件入口 |
| BuildPlugin 类型 | [`build/types.ts`](../packages/deer-mobile/src/build/types.ts) | 构建时插件接口 |
| BuildAPI 实现 | [`setup-plugin/build-api.ts`](../packages/deer-mobile/plugins/setup-plugin/build-api.ts) | modifyConfig / modifyRoutes / addRuntimePlugin |
| RuntimePlugin 类型 | [`runtime/types.ts`](../packages/deer-mobile/src/runtime/types.ts) | 12 个生命周期钩子 |
| PluginManager | [`runtime/plugin-manager.ts`](../packages/deer-mobile/src/runtime/plugin-manager.ts) | 插件注册/排序/callHook |
| createRuntimeApp | [`runtime/create-app.ts`](../packages/deer-mobile/src/runtime/create-app.ts) | 启动编排 + 路由参数校验 |
| 启动代码生成 | [`setup-plugin/code-gen.ts`](../packages/deer-mobile/plugins/setup-plugin/code-gen.ts) | 生成 virtual:setup-app |
| 路由扫描 | [`scan-pages-plugin/index.ts`](../packages/deer-mobile/plugins/scan-pages-plugin/index.ts) | 同时扫描 pages + layouts，生成路由树 |
| LayoutResolver | [`layouts/index.tsx`](../packages/deer-mobile/src/layouts/index.tsx) | 支持嵌套布局链 |
| DefaultLayout | [`layouts/default-layout.tsx`](../packages/deer-mobile/src/layouts/default-layout.tsx) | 含布局插槽 + KeepAlive |
| API 自动注入 | [`api-plugin/index.ts`](../packages/deer-mobile/plugins/api-plugin/index.ts) | 扫描 src/api/ 生成 virtual:api |
| Mock 中间件 | [`mock-plugin/index.ts`](../packages/deer-mobile/plugins/mock-plugin/index.ts) | Vite Dev Server 中间件 |
| 运行时 Pinia 插件 | [`runtime/pinia-plugin.ts`](../packages/deer-mobile/plugins/runtime/pinia-plugin.ts) | 静态导入 |
| 运行时 Auth 插件 | [`runtime/auth-plugin.ts`](../packages/deer-mobile/plugins/runtime/auth-plugin.ts) | 支持 page-level auth |
| 运行时 I18n 插件 | [`runtime/i18n-plugin.ts`](../packages/deer-mobile/plugins/runtime/i18n-plugin.ts) | 静态导入 |
| 运行时 API 插件 | [`runtime/api-plugin.ts`](../packages/deer-mobile/plugins/runtime/api-plugin.ts) | 注入 $api |
| HTTP 封装 | [`utils/request.ts`](../packages/deer-mobile/src/utils/request.ts) | 已修复 Loading + SM4 |
| Kangaroo 组件入口 | [`kangaroo-mobile/src/index.ts`](../packages/kangaroo-mobile/src/index.ts) | install 注册所有组件 |
| 组件 Demo | [`kangaroo-mobile/playground/`](../packages/kangaroo-mobile/playground/) | 所有组件 demo 页面 |
| Playground CSS | [`playground-vars.less`](../packages/kangaroo-mobile/playground/playground-vars.less) | CSS normalize + 动画类 |
