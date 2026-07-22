import type { FrameworkPlugin } from '../config-plugin';

/**
 * i18n 框架插件
 *
 * 职责：
 * 1. 自动注入 vue-i18n（Composition API 模式）
 * 2. 语言切换时自动同步 kangaroo-mobile 的 UI 组件文案
 *
 * 使用方式：
 * ```ts
 * // vite.config.ts
 * import { i18nPlugin } from 'deer-mobile'
 *
 * configPlugin({ i18n: { locale: 'zh-CN' } }, [i18nPlugin, piniaPlugin])
 * ```
 *
 * 依赖：
 * - vue-i18n（deer-mobile 内置依赖，开箱即用）
 * - kangaroo-mobile（已内置，通过 setLocale() 联动）
 */
const i18nPlugin: FrameworkPlugin = {
  name: 'i18n',

  onImport: () =>
    [
      `import { createI18n } from 'vue-i18n'`,
      `import { watch } from 'vue'`,
      `import { setLocale } from 'kangaroo-mobile'`,
      `import { appConfig } from 'virtual:app-config'`,
    ].join('\n'),

  onRuntime: () => {
    return [
      `// i18n: 仅在配置了翻译文案时启用`,
      `if (appConfig.i18n?.messages) {`,
      `  const i18n = createI18n({`,
      `    locale: appConfig.i18n?.locale ?? 'zh-CN',`,
      `    fallbackLocale: appConfig.i18n?.fallbackLocale ?? 'zh-CN',`,
      `    messages: appConfig.i18n?.messages ?? {},`,
      `    legacy: false,`,
      `  })`,
      ``,
      `  app.use(i18n)`,
      ``,
      `  // 监听语言切换，同步 kangaroo-mobile 的 UI 组件文案`,
      `  if (i18n.global.locale) {`,
      `    watch(`,
      `      () => i18n.global.locale.value,`,
      `      (newLang) => {`,
      `        if (newLang) setLocale(newLang)`,
      `      },`,
      `      { immediate: true },`,
      `    )`,
      `  }`,
      `}`,
    ].join('\n');
  },
};

export default i18nPlugin;
