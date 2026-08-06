import { defineComponent } from 'vue';

export const routeMeta = {
  title: '首页',
  layout: 'tabs',
  auth: true,
  keepAlive: true,
};

export default defineComponent({
  setup() {
    return () => (
      <div class="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <div class="text-lg mb-2">CHS 健康服务</div>
        <div class="text-sm">首页建设中</div>
      </div>
    );
  },
});
