# i18n 多语言架构方案

## 项目角色回顾

| 包 | 角色 | 说明 |
|---|------|------|
| `deer-mobile` | **框架层** | Vue 3 框架，通过 Vite Plugin 注入运行时代码 |
| `kangaroo-mobile` | **UI 组件库层** | 封装 Vant 4 的 Vue 3 移动端组件库 |
| `vant` | **底层 UI 库** | 自带 `Locale` API 可切换内部文案的语言 |

## 核心问题拆解：需要两层的国际化

### 第一层：框架应用文案 i18n（App Text）

这是业务层面的翻译——页面标题、按钮文字、菜单项、表单 label 等。

```
"pages.user.title" → "个人中心" / "Profile"
"common.submit"    → "提交" / "Submit"
```

👉 **这是 `deer-mobile` 框架的职责**

### 第二层：Vant 组件内置文案 i18n（Component Text）

Vant 组件内部有固定的文案——日历的"确认"/"取消"，Pagination 的页码文字，Search 的 placeholder 等。

```
import { Locale } from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'
Locale.use('en-US', enUS)
```

👉 **这是 `kangaroo-mobile` 的职责，但要和框架同步**

---

## 架构设计

```
┌──────────────────────────────────────────────────┐
│                  应用代码                          │
│  <template>{{ $t('pages.user.title') }}</template> │
├──────────────────────────────────────────────────┤
│                                                    │
│  deer-mobile（框架层）                              │
│  ┌────────────────────────────────────────────┐   │
│  │ i18n-plugin.ts（Vite Plugin）               │   │
│  │                                              │   │
│  │ onImport() → import { createI18n } ...      │   │
│  │ onRuntime() → 初始化 vue-i18n + 同步 Vant    │   │
│  │                                              │   │
│  │ 用户提供: messages/{zh-CN,en-US}.ts          │   │
│  └────────────────────────────────────────────┘   │
│                          │                         │
│                          ▼                         │
│  kangaroo-mobile（UI 层）                          │
│  ┌────────────────────────────────────────────┐   │
│  │ setVantLocale(lang: string)                 │   │
│  │  - 调用 Locale.use() 切换 Vant 内置文案     │   │
│  │  - 导出给框架调用                           │   │
│  └────────────────────────────────────────────┘   │
│                          │                         │
│                          ▼                         │
│  Vant 4（底层 UI 库）                              │
│  ┌────────────────────────────────────────────┐   │
│  │ Locale.use('en-US', enUS)                   │   │
│  │  - 日历确认/取消按钮                         │   │
│  │  - Pagination 文字                           │   │
│  │  - Search placeholder                        │   │
│  │  - ...                                        │   │
│  └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 关键设计决策

### 决策 1：i18n 放在 `deer-mobile` 的 Plugin 中

**理由：**

1. **一致性** — 框架所有能力都是 Plugin 提供（config、setup、scan-pages、auth、api）
2. **框架职责** — i18n 是全局基础设施，不是组件级别的功能
3. **插件钩子天然合适** — `onRuntime()` 可以注入 i18n 初始化代码到 app setup 流程

### 决策 2：Vant i18n 由 `kangaroo-mobile` 封装

**理由：**

1. **解耦** — `deer-mobile` 不应该直接依赖 Vant
2. **封装** — Vant 的 locale API 细节对框架透明
3. **可替换** — 如果以后换底层 UI 库，只需改 `kangaroo-mobile`

### 决策 3：框架 Plugin 自动同步到 Vant

i18n Plugin 的运行时在初始化 `vue-i18n` 后，自动调用 `kangaroo-mobile` 暴露的 `setVantLocale()`。对用户来说完全无感。

---

## 实现计划

### Step 1: `kangaroo-mobile` 暴露 Vant locale 工具

**文件**: `packages/kangaroo-mobile/src/locale/index.ts`

```ts
// 导出 Vant 语言包方便框架使用
import { Locale } from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import jaJP from 'vant/lib/locale/lang/ja-JP'

// 内置支持的语言映射
const vantLocaleMap: Record<string, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
}

/**
 * 切换 Vant 组件内置文案的语言
 * @param lang 语言标记，如 'zh-CN', 'en-US'
 */
export function setVantLocale(lang: string) {
  const messages = vantLocaleMap[lang]
  if (messages) {
    Locale.use(lang, messages)
  }
}
```

然后在 [`src/index.ts`](packages/kangaroo-mobile/src/index.ts) 中导出。

### Step 2: `deer-mobile` 新增 i18n Plugin

**文件**: `packages/deer-mobile/plugins/i18n-plugin.ts`

作为 FrameworkPlugin，利用 `onImport()` 和 `onRuntime()` 钩子：

```
onImport() → 生成 import { createI18n } from 'vue-i18n'
              import { setVantLocale } from 'kangaroo-mobile'

onRuntime() → 生成:
  const i18n = createI18n({
    locale: 'zh-CN',
    messages: { 'zh-CN': ..., 'en-US': ... },
    legacy: false,  // Composition API 模式
  })
  app.use(i18n)

  // 切换语言时同步 Vant
  watch(i18n.global.locale, (newLocale) => {
    setVantLocale(newLocale)
  })
```

### Step 3: 用户项目中使用

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import deer from 'deer-mobile'
import { i18nPlugin } from 'deer-mobile/i18n-plugin'

export default defineConfig({
  plugins: [
    deer({
      title: 'My App',
    }, [
      i18nPlugin({
        defaultLocale: 'zh-CN',
        messages: {
          'zh-CN': {
            'pages.user.title': '个人中心',
          },
          'en-US': {
            'pages.user.title': 'Profile',
          },
        },
      }),
    ])
  ]
})
```

---

## 为什么不直接在 Vant 里做 i18n？

Vant 的 `Locale` API 只覆盖 **组件内部固定文案**（约 20 个组件有内置文案），不覆盖：

- 业务页面标题
- 自定义表单 label / placeholder
- 按钮文字、提示信息
- 菜单项、Tab 标签

所以 **必须要有框架层的 i18n**，Vant locale 只是锦上添花的补充。

---

## 总结

| 层面 | 技术选型 | 职责 |
|------|---------|------|
| 框架 i18n | `vue-i18n`（Composition API 模式） | 业务文案国际化 |
| Vant locale | `Locale.use()` 封装在 kangaroo-mobile | 组件内置文案国际化 |
| 同步机制 | i18n-plugin runtime 自动调用 setVantLocale | 用户无感 |
