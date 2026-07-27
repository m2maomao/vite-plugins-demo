# CLI 模板选择方案（TS/JS）

> **最后更新**: 2026-07-27 | 状态: 规划中

---

## 一、大厂框架现状调研

| 框架 | 默认语言 | JS 选项 | 实现方式 |
|------|---------|--------|---------|
| **Next.js** | TypeScript | ✅ `--js` 可选 | 两套模板目录 `typescript/` + `javascript/` |
| **Umi 4** | TypeScript | ✅ 交互式选择 | 模板引擎动态渲染 |
| **Nuxt 3** | TypeScript | ❌ **无 JS 选项** | TS-only |
| **Vue 3 / Vite** | TypeScript | ✅ 交互式选择 | 多套模板目录（`vue-ts` / `vue`） |
| **Angular** | TypeScript | ⚠️ 仅 TS | TS-only |
| **Remix** | TypeScript | ❌ **无 JS 选项** | TS-only |
| **SvelteKit** | TypeScript | ❌ **无 JS 选项** | TS-only |
| **Turborepo** | TypeScript | ❌ **无 JS 选项** | TS-only |

### 趋势

**现代框架正在全面淘汰 JS 模板**：

- Nuxt 3 从未提供过 JS 模板选项
- Remix/SvelteKit 仅提供 TS
- Turborepo 仅提供 TS
- Next.js 虽然保留 `--js`，但**默认是 TS**
- create-vite 虽然提供 JS 选项，但大部分用户选择 TS（统计数据 90%+）

---

## 二、Deer Mobile 的技术依赖

deer-mobile 的核心技术栈天然依赖 TypeScript：

| 依赖 | 与 TS 的关系 |
|------|------------|
| **Vue 3 + JSX** | JSX 类型推断依赖 TS，纯 JS 下 JSX 无类型提示 |
| **BuildPlugin API** | 所有 API 都是泛型接口，JS 用户无法获得类型提示 |
| **RuntimePlugin 生命周期** | 12 个钩子的参数类型全靠 TS 推导 |
| **AppConfig** | 20+ 字段全靠 TS 补全 |
| **环境变量** | `appConfig.env` 的类型推导依赖 TS |
| **`routeMeta`** | 页面元数据的类型校验依赖 TS |

**JS 下的体验降级**：
```
TypeScript:  deer({ config: { title: '...' } })  → 编辑器提示所有字段
JavaScript:  deer({ config: { title: '...' } })  → 无任何提示，全靠记忆
```

---

## 三、结论与建议

### 建议：TS-only，不做 JS 模板

理由：
1. **行业趋势** — Nuxt 3 / Remix / SvelteKit / Turborepo 都已统一为 TS-only
2. **技术依赖** — 框架核心能力（JSX 类型推断、API 泛型、AppConfig 补全）在 JS 下严重降级
3. **维护成本** — 维护两套模板意味着双倍的测试和文档工作
4. **用户群体** — 面向企业级移动端开发，目标用户都是 TS 团队

### 不推荐的方案

| 方案 | 问题 |
|------|------|
| 两套模板目录 | 维护成本翻倍，改动需同步两份 |
| 模板引擎动态渲染 | 复杂度过高，`create-deer-mobile` 只是简单文件复制 |
| 运行时转译 JS | 增加用户心智负担，"为什么我的 JS 不报错？" |

### 最终决定

当前 `create-deer-mobile` 已经是 **TS-only**，无需改动。应将此 P3 从 TODO 中移除。
