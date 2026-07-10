# i18n 多语言架构方案

> 更新说明：聚焦 `kangaroo-mobile`，兼顾后续 `deer-mobile` 集成

---

## 核心问题：kangaroo-mobile 的 i18n 怎么选？

| 选项 | 做法 | 推荐？ |
|------|------|--------|
| **A. 沿用 Vant 的 Locale API** | 包装 `Locale.use()` 暴露 `setLocale()` | ✅ **推荐** |
| B. 自己建一套 | 自建 locale 管理，再桥接 Vant | ❌ 重复造轮子 |

### 为什么选 A？

1. **定位匹配** — `kangaroo-mobile` 是 Vant 的封装层，组件都是基于 Vant 的，Vant 的 `Locale` 已经覆盖了这些组件的内部文案（日历确认/取消、Search placeholder、Pagination 文字等）
2. **开箱即用** — Vant 已内置 30+ 语言包，无需自己维护翻译
3. **接口简洁** — 对上层（`deer-mobile` 或直接使用方）只暴露一个 `setLocale(lang)` 即可
4. **扩展灵活** — 未来 `kangaroo-mobile` 有自定义组件时，`setLocale()` 可额外接受自定义 messages 参数

---

## 架构分层

```
deer-mobile（框架层，后续实现）
┌──────────────────────────────────┐
│ i18n-plugin.ts                   │
│ - vue-i18n 管理业务文案          │
│ - 调用 kangaroo-mobile.setLocale │
│   同步 UI 组件文案               │
└──────────┬───────────────────────┘
           │ setLocale('en-US')
           ▼
kangaroo-mobile（UI 组件库层，现在实现）
┌──────────────────────────────────┐
│ src/locale/index.ts              │
│                                  │
│ setLocale(lang, customMessages?) │
│  ├─ 内部调用 Vant Locale.use()   │
│  └─ 可选：注册组件自定义文案     │
│                                  │
│ useLocale()         ← composable │
│ $t(key)             ← 模板用     │
└──────────┬───────────────────────┘
           │ Locale.use('en-US', enUS)
           ▼
Vant 4（底层 UI 库）
┌──────────────────────────────────┐
│ Locale.use('en-US', enUS)        │
│ - NavBar 返回文字                │
│ - Calendar 确认/取消             │
│ - Pagination 页数文字            │
│ - ...                            │
└──────────────────────────────────┘
```

---

## 实现计划

### Step 1: 新建 `src/locale/` 模块

**文件**: [`packages/kangaroo-mobile/src/locale/index.ts`](packages/kangaroo-mobile/src/locale/index.ts)

```ts
import { Locale } from 'vant'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enUS from 'vant/lib/locale/lang/en-US'
import jaJP from 'vant/lib/locale/lang/ja-JP'

// Vant 内置语言映射
const vantMessages: Record<string, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
}

// kangaroo-mobile 自定义组件文案
type LocaleMessages = Record<string, string>
const customMessages: Record<string, LocaleMessages> = {}

let currentLang = 'zh-CN'

/**
 * 切换语言
 * @param lang 语言标记，如 'zh-CN' | 'en-US' | 'ja-JP'
 * @param messages 可选，kangaroo-mobile 自定义组件的文案
 */
export function setLocale(lang: string, messages?: LocaleMessages) {
  currentLang = lang

  // 1. 同步 Vant 内置组件文案
  const vantMsg = vantMessages[lang]
  if (vantMsg) {
    Locale.use(lang, vantMsg)
  }

  // 2. 注册自定义组件文案
  if (messages) {
    customMessages[lang] = messages
  }
}

/**
 * 获取当前语言
 */
export function getLocale(): string {
  return currentLang
}

/**
 * 翻译 key（给自定义组件用）
 */
export function t(key: string): string {
  return customMessages[currentLang]?.[key] ?? key
}
```

### Step 2: 导出到 [`src/index.ts`](packages/kangaroo-mobile/src/index.ts)

```ts
export { setLocale, getLocale, t } from './locale'
```

### Step 3: 后续 `deer-mobile` i18n Plugin 集成

待 `kangaroo-mobile` 完成后再实现。Plugin 的工作就是：

```
onRuntime() → 生成代码:
  import { setLocale } from 'kangaroo-mobile'
  import { createI18n } from 'vue-i18n'

  const i18n = createI18n({ ... })
  app.use(i18n)

  watch(i18n.global.locale, (newLang) => {
    setLocale(newLang)  // 切换 UI 组件文案
  })
```

两个包完全解耦，通过 `setLocale()` 这一个接口连接。

---

## 为什么 kangaroo-mobile 不直接用 vue-i18n？

因为 **职责不同**：

| 工具 | kangaroo-mobile 用？ | 理由 |
|------|---------------------|------|
| Vant `Locale` | ✅ 核心 | 组件内部文案翻译 |
| `vue-i18n` | ❌ 不用 | 那是框架层的职责（业务文案），kangaroo 是 UI 库不应依赖它 |
| 自己的 `t()` | ⚠️ 轻量 | 只在 kangaroo-mobile 自定义组件内部使用 |

用 Vant 的 Locale + 一个非常轻量的 `t()` 函数就够了，不需要引入 `vue-i18n` 这么大的依赖。
