# Deer Mobile 框架层 i18n 集成方案

## 背景

- `kangaroo-mobile`（UI 组件库）**已完成** i18n 支持：`setLocale()` / `createTranslate()` / `onLocaleChange()` / `i18nPlugin`
- `deer-mobile`（框架层）**尚未集成** `vue-i18n` 来管理 **业务文案**
- 目标：用户通过 `vue-i18n` 管理业务翻译，语言切换时自动联动 `kangaroo-mobile` 的组件文案

## 架构分层

```
deer-mobile（框架层 — 本次实现）
┌──────────────────────────────────────┐
│ i18n-plugin.ts                       │
│ - FrameworkPlugin 模式               │
│ - 自动注入 vue-i18n + 联动 kangaroo  │
└──────────┬───────────────────────────┘
           │ setLocale('en-US')
           ▼
kangaroo-mobile（UI 组件库层 — 已完成）
┌──────────────────────────────────────┐
│ setLocale() / createTranslate()      │
│ - 同步 Vant Locale 组件文案          │
│ - 管理自定义组件文案                 │
└──────────────────────────────────────┘
```

## 改动清单

### Step 1: 新建 `packages/deer-mobile/plugins/i18n-plugin/index.ts`

创建一个 `FrameworkPlugin`，遵循 `piniaPlugin` 的模式：

```ts
// onImport() → 生成 import 语句
import { createI18n } from 'vue-i18n'
import { setLocale, type LocaleLang } from 'kangaroo-mobile'

// onRuntime() → 生成启动代码
const i18n = createI18n({
  locale: 'zh-CN',        // 从 appConfig 读取
  fallbackLocale: 'zh-CN',
  messages: { /* 从 appConfig 读取 */ },
  legacy: false,           // Composition API 模式
})

app.use(i18n)

// 监听语言切换，同步 kangaroo-mobile
watch(
  () => i18n.global.locale,
  (newLang) => {
    setLocale(newLang as LocaleLang)
  },
)
```

关键设计点：
- `locale` 初始值从 `appConfig.i18n.locale` 读取
- 通过 `watch(i18n.global.locale)` 监听变化同步到 `kangaroo-mobile`
- 使用 `legacy: false`（Composition API 模式）

### Step 2: 更新 `packages/deer-mobile/plugins/config-plugin/index.ts`

在 `AppConfig` 接口中新增 `i18n` 配置：

```ts
interface AppConfig {
  // ... 现有字段
  i18n?: {
    locale: string           // 默认语言，如 'zh-CN'
    fallbackLocale?: string  // 回退语言
    messages?: Record<string, Record<string, Record<string, string>>>  // vue-i18n 格式的翻译
  }
}
```

### Step 3: 更新 `packages/deer-mobile/src/virtual-modules.d.ts`

同步更新类型声明，添加 `i18n` 字段。

### Step 4: 更新 `packages/deer-mobile/index.ts`

添加导出：

```ts
export { default as i18nPlugin } from './plugins/i18n-plugin';
```

### Step 5: 更新 `packages/deer-mobile/package.json`

在 `peerDependencies` 中添加 `vue-i18n`（可选依赖）：

```json
"peerDependencies": {
  "vue-i18n": "^10.0.0 || ^11.0.0"
},
"peerDependenciesMeta": {
  "vue-i18n": { "optional": true }
}
```

### Step 6: 更新 example 和 template

- `apps/example/vite.config.ts` — 添加 `i18nPlugin` 用法示例
- `packages/create-deer-mobile/template/vite.config.ts` — 添加 `i18nPlugin` 用法示例

## 使用方式

用户在 `vite.config.ts` 中：

```ts
import { i18nPlugin } from 'deer-mobile'

export default defineConfig({
  plugins: [
    configPlugin({
      i18n: {
        locale: 'zh-CN',
        messages: {
          'zh-CN': {
            message: { hello: '你好' },
          },
          'en-US': {
            message: { hello: 'Hello' },
          },
        },
      },
    }, [i18nPlugin, piniaPlugin]),
    setupPlugin(),
    // ... 其他插件
  ],
})
```

然后在组件中使用：

```ts
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// 切换语言时自动同步 UI 组件文案
locale.value = 'en-US'
```

## 不涉及改动

- `kangaroo-mobile` — 不需要任何修改，只通过 `setLocale()` 接口联动
- `setup-plugin` — 不需要修改，自动收集 FrameworkPlugin 的 onRuntime 代码
- `_shared.ts` — 不需要修改
