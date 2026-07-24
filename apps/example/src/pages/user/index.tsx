import { defineComponent, h } from 'vue';
import { RouterView } from 'vue-router';

export const routeMeta = {
  title: '用户中心',
  layout: ['default', 'user'],
};

/**
 * 用户模块父路由 — 渲染 <router-view> 显示子页面
 */
export default defineComponent({
  setup() {
    return () =>
      h('div', { class: 'p-4' }, [
        h('h1', { class: 'text-2xl font-bold text-purple-700 mb-4' }, '用户中心'),
        h(RouterView),
      ]);
  },
});
