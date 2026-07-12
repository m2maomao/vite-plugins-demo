/**
 * useTranslate — Demo 页面国际化工具
 *
 * 对标 Vant 4 的 useTranslate 模式：
 * 每个 demo 组件自己携带 i18n 文案，自动注册到全局 Locale 系统。
 *
 * @example
 * ```ts
 * const t = useTranslate({
 *   'zh-CN': { basicUsage: '基础用法', customSize: '自定义大小' },
 *   'en-US': { basicUsage: 'Basic Usage', customSize: 'Custom Size' },
 * })
 *
 * t('basicUsage') // '基础用法'
 * ```
 */

import { setLocale, getLocale, createTranslate } from './index'
import type { LocaleMessages, Translate } from './index'

let demoUid = 0

export function useTranslate(i18n: Record<string, Record<string, string>>): Translate {
  const demoName = `demo-i18n-${demoUid++}`
  const prevLang = getLocale()

  // 将 i18n 按语言拆分注册到 Locale 系统
  // 注意：必须在注册前保存 prevLang，因为 setLocale 会改变 getLocale() 的返回值
  Object.keys(i18n).forEach((lang) => {
    setLocale(lang as any, {
      [demoName]: i18n[lang],
    } as LocaleMessages)
  })

  // 恢复用户当前选择的语言
  setLocale(prevLang)

  return createTranslate(demoName)
}
