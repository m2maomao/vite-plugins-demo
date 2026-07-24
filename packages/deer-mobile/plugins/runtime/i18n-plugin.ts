/**
 * Deer Mobile — I18n Runtime Plugin
 *
 * 自动注入 vue-i18n，语言切换时同步 kangaroo-mobile 的 UI 组件文案。
 *
 * 优先级: 5
 * 钩子: onAppCreated（创建 i18n）, onRouterCreated（监听语言切换）
 */

import { watch } from 'vue';
import { createI18n } from 'vue-i18n';
import { setLocale } from 'kangaroo-mobile';
import type { RuntimePlugin } from '../../src/runtime/types';

const i18nRuntimePlugin: RuntimePlugin = {
  name: 'deer:i18n',
  priority: 5,

  onAppCreated: (app, ctx) => {
    const i18nConfig = ctx.config.i18n;
    if (!i18nConfig?.messages) return;

    const i18n = createI18n({
      locale: i18nConfig.locale ?? 'zh-CN',
      fallbackLocale: i18nConfig.fallbackLocale ?? 'zh-CN',
      messages: i18nConfig.messages ?? {},
      legacy: false,
    });

    app.use(i18n);

    // 存储 i18n 实例到插件共享数据空间，供 onRouterCreated 使用
    ctx.data.set('i18n', i18n);
  },

  onRouterCreated: (_router, ctx) => {
    const i18n = ctx.data.get('i18n') as { global: { locale: { value: string } } } | undefined;
    if (!i18n?.global?.locale) return;

    // 监听语言切换，同步 kangaroo-mobile UI 组件文案
    watch(
      () => i18n.global.locale.value,
      (newLang) => {
        if (newLang) setLocale(newLang as 'zh-CN' | 'en-US' | 'ja-JP');
      },
      { immediate: true },
    );
  },
};

export default i18nRuntimePlugin;
