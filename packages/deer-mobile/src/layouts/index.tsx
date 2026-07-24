import { defineComponent, computed, h } from 'vue';
import { useRoute } from 'vue-router';
import type { Component } from 'vue';
import DefaultLayout from './default-layout';
import BlankLayout from './blank-layout';
import TabBarLayout from './tab-bar';

/**
 * 布局注册表：route.meta.layout → 布局组件
 * 用户可在 routeMeta 中通过 layout 字段选择布局
 *
 * 扩展方式：在此添加新的布局组件即可
 * ```typescript
 * import CustomLayout from './custom-layout';
 * const LAYOUT_REGISTRY = { ..., custom: CustomLayout };
 * ```
 */
const LAYOUT_REGISTRY: Record<string, Component> = {
  default: DefaultLayout,
  blank: BlankLayout,
  tabs: TabBarLayout,
};

/**
 * 布局解析器 — 根据当前路由的 route.meta.layout 动态选择布局组件
 *
 * 使用方式（在页面文件中）：
 * ```typescript
 * export const routeMeta = { layout: 'blank' }  // 空白布局（登录页）
 * export const routeMeta = { layout: 'default' } // 默认布局（header/footer）
 * export const routeMeta = { layout: 'tabs' }    // TabBar 布局
 * ```
 */
export default defineComponent({
  name: 'LayoutResolver',
  setup() {
    const route = useRoute();

    const layoutComponent = computed(() => {
      const layoutName = (route.meta?.layout as string) || 'default';
      return LAYOUT_REGISTRY[layoutName] || DefaultLayout;
    });

    return () => h(layoutComponent.value);
  },
});
