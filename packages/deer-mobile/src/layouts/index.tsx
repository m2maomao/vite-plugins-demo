import { defineComponent, computed, h } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import type { Component, VNode } from 'vue';
import DefaultLayout from './default-layout';
import BlankLayout from './blank-layout';
import TabBarLayout from './tab-bar';
import UserLayout from './user-layout';

/**
 * 布局注册表：route.meta.layout → 布局组件
 * 支持单布局（字符串）和嵌套布局（数组）两种模式
 */
const LAYOUT_REGISTRY: Record<string, Component> = {
  default: DefaultLayout,
  blank: BlankLayout,
  tabs: TabBarLayout,
  user: UserLayout,
};

/**
 * 递归渲染布局链
 * 将 ['default', 'user'] 渲染为 <DefaultLayout><UserLayout><RouterView /></UserLayout></DefaultLayout>
 */
function renderLayoutChain(layouts: Component[], index: number): VNode {
  if (index >= layouts.length) {
    // 最内层：渲染 <RouterView>，由 vue-router 解析页面组件
    return h(RouterView);
  }
  const Layout = layouts[index];
  // 将下一层作为 children 传入，由布局组件通过 ctx.slots.default 接收
  return h(Layout, null, { default: () => renderLayoutChain(layouts, index + 1) });
}

/**
 * 布局解析器 — 支持单布局和嵌套布局链
 *
 * 单布局（字符串）：
 * ```typescript
 * export const routeMeta = { layout: 'default' }
 * ```
 *
 * 嵌套布局（数组）：
 * ```typescript
 * export const routeMeta = { layout: ['default', 'user'] }
 * // 渲染：<DefaultLayout><UserLayout><RouterView /></UserLayout></DefaultLayout>
 * ```
 */
export default defineComponent({
  name: 'LayoutResolver',
  setup() {
    const route = useRoute();

    const layouts = computed(() => {
      const layout = route.meta?.layout;
      // 支持字符串（单布局）和数组（嵌套布局链）
      const names: string[] = Array.isArray(layout) ? layout : [layout || 'default'];
      return names.map((name) => LAYOUT_REGISTRY[name] || DefaultLayout);
    });

    return () => renderLayoutChain(layouts.value, 0);
  },
});
