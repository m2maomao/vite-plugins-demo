import { defineComponent, h } from 'vue';
import { RouterView } from 'vue-router';
import type { VNode } from 'vue';

/**
 * 空白布局 — 仅渲染页面内容，无 header/footer
 *
 * 支持嵌套布局：如果传入了 children（由 LayoutResolver 链式渲染时传入），
 * 则渲染 children 替代 <RouterView>。
 */
export default defineComponent({
  setup() {
    return (props: any, ctx: any) => {
      const children = ctx?.slots?.default?.();
      return h('div', { class: 'min-h-screen' }, children || h(RouterView));
    };
  },
});
