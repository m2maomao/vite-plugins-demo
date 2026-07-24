import { defineComponent, h } from 'vue';
import { RouterView } from 'vue-router';

/**
 * 空白布局 — 仅渲染页面内容，无 header/footer
 * 适用于登录页、404 页等不需要导航栏的页面
 */
export default defineComponent({
  setup() {
    return () => h('div', { class: 'min-h-screen' }, h(RouterView));
  },
});
