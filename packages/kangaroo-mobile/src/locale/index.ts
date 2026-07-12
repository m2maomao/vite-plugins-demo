// ============================================
// Kangaroo Mobile — Locale / i18n
// ============================================
// 设计原则：
// 1. 沿用 Vant 4 的 Locale API（Vant 已内置 30+ 语言包）
// 2. 提供 createTranslate(name) 模式 — 与 Vant 4 一致的 API
// 3. 轻量包装，不引入 vue-i18n
// 4. 为未来 deer-mobile 集成预留 setLocale() 接口
// ============================================

import { Locale } from 'vant'
import zhCN from 'vant/es/locale/lang/zh-CN'
import enUS from 'vant/es/locale/lang/en-US'
import jaJP from 'vant/es/locale/lang/ja-JP'

// -------------------------------------------
// 类型定义
// -------------------------------------------

/** 支持的语言列表 */
export type LocaleLang = 'zh-CN' | 'en-US' | 'ja-JP'

/** 命名空间文案映射: { namespace: { key: value } } */
export type LocaleMessages = Record<string, Record<string, string>>

/** 翻译函数 */
export type Translate = (path: string) => string

// -------------------------------------------
// 内部状态
// -------------------------------------------

/** Vant 内置语言包映射 */
const vantMessages: Record<string, Record<string, any>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
}

/**
 * kangaroo-mobile 自定义组件文案
 *
 * 结构: { lang: { namespace: { key: value } } }
 *
 * @example
 * {
 *   'en-US': {
 *     'yhNavBar': { back: 'Back', home: 'Home' },
 *     'yhButton': { submit: 'Submit' },
 *   }
 * }
 */
const customMessages: Record<string, LocaleMessages> = {}

/** 全局通用文案（如 basicUsage、disabled 等），供所有 demo 共享 */
const globalMessages: Record<string, Record<string, string>> = {}

let currentLang: LocaleLang = 'zh-CN'

// -------------------------------------------
// 核心 API
// -------------------------------------------

/**
 * 创建命名空间翻译函数
 *
 * 与 Vant 4 的 createTranslate 风格一致。
 * 返回的 t 函数会从当前语言的 messages 中查找 `${namespace}.${path}` 的翻译。
 *
 * @param namespace  命名空间，如 'yhNavBar'
 * @returns 翻译函数 (path: string) => string
 *
 * @example
 * ```ts
 * import { createTranslate } from 'kangaroo-mobile'
 *
 * const t = createTranslate('yhNavBar')
 * t('back') // '返回' 或 'Back'
 * ```
 */
export function createTranslate(namespace: string): Translate {
  return (path: string) => {
    const nsMessages = customMessages[currentLang]?.[namespace]
    return nsMessages?.[path] ?? globalMessages[currentLang]?.[path] ?? path
  }
}

/**
 * 切换语言
 *
 * @param lang  语言标记，如 'zh-CN' | 'en-US' | 'ja-JP'
 * @param messages  可选，kangaroo-mobile 自定义组件的命名空间文案
 *
 * @example
 * ```ts
 * import { setLocale } from 'kangaroo-mobile'
 *
 * // 切换到英文（Vant 内置组件自动跟随）
 * setLocale('en-US')
 *
 * // 切换语言并注册自定义组件文案
 * setLocale('en-US', {
 *   yhNavBar: { back: 'Back' },
 * })
 * ```
 */
export function setLocale(lang: LocaleLang, messages?: LocaleMessages) {
  currentLang = lang

  // 1. 同步 Vant 内置组件的文案（Calendar / Pagination / Search 等）
  const vantMsg = vantMessages[lang]
  if (vantMsg) {
    Locale.use(lang, vantMsg)
  }

  // 2. 注册 kangaroo-mobile 自定义组件文案
  if (messages) {
    customMessages[lang] = {
      ...(customMessages[lang] || {}),
      ...messages,
    }
  }

  // 3. 通知内部监听者
  localeChangeCallbacks.forEach(cb => cb(lang))
}

/**
 * 获取当前语言
 *
 * @example
 * ```ts
 * const lang = getLocale() // 'zh-CN'
 * ```
 */
/**
 * 注册全局通用文案（供所有 demo 共享，如 basicUsage、disabled 等）
 * 不会改变 currentLang
 */
export function addGlobalMessages(messages: Record<string, Record<string, string>>) {
  Object.keys(messages).forEach((lang) => {
    globalMessages[lang] = {
      ...(globalMessages[lang] || {}),
      ...messages[lang],
    }
  })
}

export function getLocale(): LocaleLang {
  return currentLang
}

// -------------------------------------------
// 语言变更监听（供内部组件使用）
// -------------------------------------------

const localeChangeCallbacks: Array<(lang: LocaleLang) => void> = []

/**
 * 监听语言变化（供 kangaroo-mobile 内部组件响应式使用）
 *
 * @example
 * ```ts
 * import { onLocaleChange } from 'kangaroo-mobile'
 *
 * onLocaleChange((lang) => {
 *   // 重新获取翻译或更新 UI
 * })
 * ```
 */
export function onLocaleChange(cb: (lang: LocaleLang) => void) {
  localeChangeCallbacks.push(cb)
}

// -------------------------------------------
// Vue Plugin 安装（仅用于 playground / 直接使用）
// -------------------------------------------

/**
 * 安装 i18n 插件
 *
 * 通过 provide/inject 注入翻译函数，Composition API 推荐直接用 createTranslate()。
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import App from './App.vue'
 * import KangarooMobile, { i18nPlugin } from 'kangaroo-mobile'
 *
 * const app = createApp(App)
 * app.use(KangarooMobile)
 * app.use(i18nPlugin, { locale: 'en-US' })
 * app.mount('#app')
 * ```
 */
export const I18N_KEY = Symbol('kangaroo-i18n')

export const i18nPlugin = {
  install(
    app: any,
    options?: {
      locale?: LocaleLang
      messages?: LocaleMessages
    }
  ) {
    const lang = options?.locale || 'zh-CN'
    setLocale(lang, options?.messages)

    // 通过 provide 注入翻译函数
    app.provide(I18N_KEY, (path: string) => {
      const parts = path.split('.')
      if (parts.length === 2) {
        const [ns, key] = parts
        return createTranslate(ns)(key)
      }
      return path
    })
  },
}
