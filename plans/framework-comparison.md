# Deer Mobile 框架状态与对比

## 已完成功能 ✅

| 模块 | 状态 | 实现方式 |
|------|------|---------|
| Vite 构建 | ✅ | Vite 8 + TypeScript 6 |
| 约定式路由 | ✅ | `src/pages/` 自动扫描 |
| 动态路由 | ✅ | `[id].tsx` → `/user/:id` |
| 布局系统 | ✅ | 可配置 `noNavPages` |
| HTTP 封装 | ✅ | axios + 自动 token |
| API 自动扫描 | ✅ | 扫描 `src/api/` + DI 注入 |
| 鉴权系统 | ✅ | 路由守卫 + token 管理 |
| 登录页 | ✅ | 内置模板，开箱即用 |
| 404 页面 | ✅ | 内置模板 |
| 代码注入 | ✅ | setup-plugin 自动生成启动代码 |
| 配置管理 | ✅ | config-plugin + 虚拟模块 |
| 状态管理 | ❌ 未集成 | 可按需安装 pinia | 进行中test
| 脚手架 CLI | ✅ | `create-deer-mobile` |
| Tailwind CSS | ✅ | v4 集成 |
| `@vueuse/core` | ✅ | useStorage 响应式存储 |
| ESLint | ✅ | 0 error 0 warning |

## 缺失功能 ❌

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P1 | **移动端适配** | rem/vw 转换，viewport 适配 |
| P1 | **国际化 i18n** | vue-i18n 集成 |
| P2 | **主题系统** | dark/light 模式切换 |
| P2 | **单元测试** | vitest 测试框架 |
| P3 | **全局 Loading** | 路由切换加载动画 |
| P3 | **PWA** | 离线访问 |
| P3 | **CI/CD** | 自动发布 |
| P3 | **图标系统** | iconify / SVG 图标集成 |
| P3 | **业务状态码** | 统一错误码枚举 + 拦截处理 |
| P3 | **Mock 数据** | 内置 mock 接口能力 |
| P3 | **环境变量封装** | `.env` 文件管理封装 |
| P3 | **构建分析** | 打包体积分析工具 |
| P3 | **Prettier** | 代码格式化 |
| P3 | **模板选择** | CLI 创建时选 TS/JS |
| P3 | **文档站点** | API 文档 |
| P4 | **组件库** | 类似 Vant 的 UI 组件 |
