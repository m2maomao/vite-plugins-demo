# Deer Mobile 框架状态与对比

## 已完成功能 ✅

### `deer-mobile` 框架核心

| 模块 | 状态 | 实现方式 |
|------|------|---------|
| Vite 构建 | ✅ | Vite 8 + TypeScript 6 |
| 约定式路由 | ✅ | `src/pages/` 自动扫描 |
| 动态路由 | ✅ | `[id].tsx` → `/user/:id` |
| 布局系统 | ✅ | 可配置 `noNavPages` |
| HTTP 封装 | ✅ | axios + 自动 token + 业务状态码拦截 |
| API 自动扫描 | ✅ | 扫描 `src/api/` + DI 注入 |
| 鉴权系统 | ✅ | 路由守卫 + token 管理 |
| 登录页 | ✅ | 内置模板，开箱即用 |
| 404 / error / loading 页面 | ✅ | 内置模板，开箱即用 |
| 代码注入 | ✅ | setup-plugin 自动生成启动代码 |
| 配置管理 | ✅ | config-plugin + 虚拟模块 `virtual:app-config` |
| **状态管理** | ✅ **已集成** | **pinia 3.x，`useUserStore` 开箱即用** |
| 脚手架 CLI | ✅ | `create-deer-mobile` |
| Tailwind CSS | ✅ | v4 集成 |
| `@vueuse/core` | ✅ | useStorage 响应式存储 |
| ESLint | ✅ | 0 error 0 warning |
| **移动端适配** | ✅ **已完成** | **运行时 rem 动态缩放，`setupFlexible()` 自动调用，支持 375px 设计稿基准** |
| **业务状态码体系** | ✅ **已完成** | **1xx 成功 / 2xx 告警 / 712/205/209 登录超时 / 110/112 Token 失效，`status.ts` 统一管理** |
| **SM4 加解密** | ✅ **已完成** | **`sm-crypto` optional 依赖，通过 `appConfig.sm4Key` 配置启用** |
| **Prettier 格式化** | ✅ **已完成** | **模板内置 `.prettierrc` + lint-staged 自动格式化** |

### `kangaroo-mobile` UI 组件库

| 模块 | 状态 | 说明 |
|------|------|------|
| **图标系统** | ✅ 已完成 | Iconify + Vant 兜底 + 本地 deer 自定义图标，`YhmIcon` 统一入口 |
| **国际化 i18n** | ✅ 已完成 | Vant Locale 封装，`setLocale` / `createTranslate` / `i18nPlugin` |
| **主题系统** | ✅ 已完成 | 品牌色 CSS 变量 + Vant 变量覆盖 + 暗黑模式 |
| **组件库** | ✅ 已完成 | 45+ 组件全部基于 Vant 4 二次封装 |
| **Playground** | ✅ 已完成 | 组件 Demo 演示页面 |

---

## 缺失功能 ❌

| 优先级 | 功能 | 说明 |
|--------|------|------|
| **P1** | **国际化 i18n（框架层）** | `deer-mobile` 集成 vue-i18n 管理业务文案，联动 `kangaroo-mobile` 的 `setLocale()` |
| P2 | **主题系统（框架层）** | 运行时主题切换能力（config-plugin 已有 `theme` 配置字段但未实现运行时切换） |
| P2 | **单元测试** | vitest 测试框架 |
| P3 | 全局 Loading | 路由切换加载动画 |
| P3 | PWA | 离线访问 |
| P3 | CI/CD | 自动发布 |
| P3 | Mock 数据 | 内置 mock 接口能力 |
| P3 | 环境变量封装 | `.env` 文件管理封装 |
| P3 | 构建分析 | 打包体积分析工具 |
| P3 | 模板选择 | CLI 创建时选 TS/JS |
| P3 | 文档站点 | API 文档 |

## 已实现功能对照源码

### 移动端适配 — `packages/deer-mobile/src/utils/flexible.ts`

- 运行时 rem 动态缩放，原理同 uni-app H5（类似 lib-flexible）
- 公式：`rootFontSize = 16px × (clientWidth / baseWidth)`
- 默认基准宽度 375px（iPhone SE），最大适配宽度 960px
- 在 `setup-plugin` 中自动调用 `setupFlexible()`

### 业务状态码 — `packages/deer-mobile/src/utils/status.ts`

- HTTP 状态码中文映射（400~504）
- 业务状态码分类：1xx 成功、2xx 告警
- 授权异常码：110、112、205、209、712
- 工具函数：`getStatusMsg`、`isSuccessStatus`、`isWarningStatus`、`isAuthError`、`isTokenExpired`

### SM4 加解密 — `packages/deer-mobile/src/utils/request.ts`

- `sm4EncryptAsync` / `sm4DecryptAsync` 异步懒加载
- 通过 `appConfig.sm4Key` 配置密钥，不配置则不启用
- `sm-crypto` 作为 optional peerDependency
