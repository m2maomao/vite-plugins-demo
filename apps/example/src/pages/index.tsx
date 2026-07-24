import { defineComponent } from 'vue';

export const routeMeta = {
  title: '首页',
  layout: 'default',
  auth: true,
  transition: 'fade',
};

export default defineComponent({
  setup() {
    return () => <div>首页</div>;
  },
});
