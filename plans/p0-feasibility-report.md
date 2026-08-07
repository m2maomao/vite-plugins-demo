# P0 可行性验证报告：deer-uni 工程底座

> **日期**：2026-08-07
> **结论**：✅ **全部核心链路验证可行** —— uniapp + Vue3 + Vite + wot-ui + 自研组件库 kangaroo-uni 双端（H5 + 微信小程序）编译运行均通过。
> **关联文档**：主方案 [`uniapp-uviewplus-architecture.md`](./uniapp-uviewplus-architecture.md)、unibest 对照 [`unibest-vs-deer-uni-analysis.md`](./unibest-vs-deer-uni-analysis.md)。

---

## 一、验证环境

| 项 | 值 |
|---|---|
| 系统 | Windows 11（cmd 终端） |
| Node | **22.22.2（LTS，推荐）**，通过 nvm 切换 |
| pnpm | 10.34.5（全局安装，镜像 npmmirror） |
| 工程位置 | [`packages/deer-uni`](../packages/deer-uni/package.json)（monorepo 内） |
| 模板来源 | 官方 `dcloudio/uni-preset-vue#vite`（degit 克隆），**非 unibest fork** |
| @dcloudio | 3.0.0-5010520260709002（官方最新 Vue3 线） |
| wot-design-uni | ^1.14.0（npm 安装） |

## 二、验证步骤与结果

| # | 步骤 | 结果 |
|---|---|---|
| 1 | nvm 切换 node 到 22.22.2 | ✅ 生效 |
| 2 | 安装 pnpm 10 | ✅ pnpm 10.34.5 |
| 3 | degit 官方模板创建 `packages/deer-uni` | ✅ 官方 Vue3+Vite 结构 |
| 4 | `.npmrc` 配置 `shamefully-hoist=true` + 镜像 | ✅ pnpm + uniapp 兼容 |
| 5 | `pnpm install`（1405 包） | ✅ 成功 |
| 6 | `pnpm dev:h5` | ✅ Vite5 dev server，HTTP 200 |
| 7 | 接入 wot-design-uni + pages.json easycom | ✅ 页面无 import 直接用 `<wd-*>` 组件 |
| 8 | `pnpm dev:mp-weixin` | ✅ 产物 `dist/dev/mp-weixin` 完整生成 |
| 9 | 搭建 `kangaroo-uni` 首个 `k-button`（基于 wd-button 二次封装） | ✅ H5 + 小程序双端 easycom 生效 |

## 三、关键验证点明细

### 3.1 wot-ui 接入（easycom 生效）

- pages.json easycom custom：`"^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"`
- H5 编译产物含 `wot-design-uni` 引用；小程序 `usingComponents` 含 `wd-button / wd-tag / wd-cell`，且 `node-modules/wot-design-uni/...` 组件 4 件套（js/json/wxml/wxss）完整生成。

### 3.2 kangaroo-uni 二次封装（核心验证点）

- 组件位置：`src/uni_modules/kangaroo-uni/components/k-button/k-button.vue`
- easycom custom：`"^k-(.*)": "@/uni_modules/kangaroo-uni/components/k-$1/k-$1.vue"`
- 组件实现：`biz` 业务态 → wot-ui `type` 统一映射（`primary/success/cancel→info/warning/danger→error`），收敛设计规范。
- 结果：
  - **H5**：页面模块含 `kangaroo-uni` + `k-button` 引用 ✅
  - **小程序**：`usingComponents` 含 `k-button`，产物 `uni_modules/kangaroo-uni/components/k-button/`（js/json/wxml）✅

> **P1 变更**：组件前缀由 `k-` 统一改为 **`yhu-`**（`yhu-button` / `yhu-cell` / `yhu-field` / `yhu-tag`）；组件库由 `src/uni_modules` 形态改为**独立 npm 包** `packages/kangaroo-uni`（发布 npmjs）；easycom 规则为 `"^yhu-(.*)": "kangaroo-uni/components/yhu-$1/yhu-$1.vue"`。

### 3.3 踩坑与解法（对后续团队有复用价值）

| 坑 | 现象 | 解法 |
|---|---|---|
| pnpm 无 TTY | `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` | `pnpm install --config.confirmModulesPurge=false` |
| sass 缺失 | `Preprocessor dependency "sass" not found`（wot-ui 组件样式用 scss） | `pnpm add -D sass` |
| 小程序 easycom 不生效 | `usingComponents` 无 k-button，增量编译不重读 easycom | **重启 `dev:mp-weixin` 全量编译**；并将 kangaroo-uni 加入 easycom custom 规则 |
| pages.json 注释 | JSON 校验报错 | 改为纯净 JSON（DCloud 虽支持 jsonc，但为编辑器干净移除） |
| sass deprecation 刷屏 | wot-ui 内部 `@import` 旧语法警告 | 非错误，不影响编译；后续可用 `css.preprocessorOptions.scss.silenceDeprecations` 抑制 |
| **小程序端 workspace 包依赖分析**（P1 发现） | `node-modules/kangaroo-uni/... 已被代码依赖分析忽略`、`Component is not found in path` | 根因：kangaroo-uni 为 **pnpm workspace 符号链接**，微信工具「过滤无依赖文件」不识别其依赖关系。**定案**：kangaroo-uni 发布为**独立 npm 包（私有 registry）**，业务项目真实安装后无此问题；**monorepo 开发期**临时关闭微信工具「过滤无依赖文件」，发布 `build:mp` 不受影响 |

## 四、遗留事项（非 P0 阻断）

1. **微信开发者工具预览**：`pnpm dev:mp-weixin` 产物已就绪，需用户用微信开发者工具导入 `packages/deer-uni/dist/dev/mp-weixin`（首次开启「服务端口」）；
2. **@uni-helper 插件链**：当前用官方模板（仅 `@dcloudio/vite-plugin-uni`）；后续 P2 可参考 unibest 接入 `@uni-helper/vite-plugin-uni-pages`（约定式路由）、layouts 等，属增强项非必需；
3. **kangaroo-uni 独立成包**：当前以 `src/uni_modules` 形态验证；后续 P1 抽象为 `packages/kangaroo-uni` 独立包（workspace 依赖 + easycom 指向 npm 包路径）；
4. **TypeScript 化**：当前官方模板为 JS（`vite.config.js` / `main.js`）；后续 P1/P2 迁移为 TS。
5. **kangaroo-uni 部署形态定案（P1 决策）**：多项目框架场景下，kangaroo-uni 为**独立 npm 包**，发布到私有 registry，业务项目 `npm install kangaroo-uni`（真实目录，微信工具正常）+ semver 升级；monorepo 开发期用 workspace 链接 + 微信工具开发期关闭「过滤无依赖文件」（发布 `build:mp` 不受影响）。

## 五、结论与下一步

- **P0 验证通过**：自研 deer-uni（非 unibest fork）+ wot-ui + kangaroo-uni 中间层 + 双端编译的整条技术路线可行。
- **建议下一步（P1）**：
  1. kangaroo-uni 独立成包（`packages/kangaroo-uni`）+ 主题系统（业务品牌色收敛 + wot-ui 主题变量）；
  2. 工程 TS 化（vite.config.ts / tsconfig / main.ts）；
  3. 参考 unibest 的 `http/interceptor`、`router/permission` 搭建 deer-uni 框架层（P2）。
