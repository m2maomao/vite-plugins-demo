import { defineComponent } from 'vue';

export const routeMeta = {
  title: '关于我们',
  layout: 'default',
  auth: true,
  transition: 'slide-up',
};

export default defineComponent({
  setup() {
    return () => <div>关于我们</div>;
  },
});
