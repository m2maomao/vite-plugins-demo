import { defineComponent, computed, h } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import type { Component, VNode } from 'vue';
import DefaultLayout from './default-layout';
import BlankLayout from './blank-layout';
import TabBarLayout from './tab-bar';
import UserLayout from './user-layout';

/**
 * 内置布局注册表：route.meta.layout → 布局组件
 */
const BUILTIN_LAYOUTS: Record<string, Component> = {
  default: DefaultLayout,
  blank: BlankLayout,
  tabs: TabBarLayout,
  user: UserLayout,
};

/**
 * 自动扫描的布局注册表 — 来自 `virtual:layout-registry`（由 scanPagesPlugin 生成）
 * 用户将 .tsx 文件放在 src/layouts/ 目录下即可自动注册
 */
let autoLayouts: Record<string, Component> = {};
try {
  // Vite 会在构建时解析此虚拟模块；如果 scanPagesPlugin 未启用，此导入会返回空对象
  const { layoutRegistry } = await import('virtual:layout-registry');
  autoLayouts = layoutRegistry || {};
} catch {
  // scanPagesPlugin 未启用或未配置，仅使用内置布局
}

/**
 * 完整布局注册表：内置布局 + 自动发现的布局
 * 用户自定义布局优先级高于同名内置布局
 */
const LAYOUT_REGISTRY: Record<string, Component> = {
  ...BUILTIN_LAYOUTS,
  ...autoLayouts,
};

/**
 * 递归渲染布局链
 * 将 ['default', 'user'] 渲染为 <DefaultLayout><UserLayout><RouterView /></UserLayout></DefaultLayout>
 */
function renderLayoutChain(layouts: Component[], index: number): VNode {
  if (index >= layouts.length) {
    return h(RouterView);
  }
  const Layout = layouts[index];
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
 * ```
 *
 * 自动发现布局（将 .tsx 文件放入 src/layouts/ 目录）：
 * ```typescript
 * // src/layouts/admin.tsx → 可通过 routeMeta = { layout: 'admin' } 使用
 * ```
 */
export default defineComponent({
  name: 'LayoutResolver',
  setup() {
    const route = useRoute();

    const layouts = computed(() => {
      const layout = route.meta?.layout;
      const names: string[] = Array.isArray(layout) ? layout : [layout || 'default'];
      return names.map((name) => LAYOUT_REGISTRY[name] || DefaultLayout);
    });

    return () => renderLayoutChain(layouts.value, 0);
  },
});
