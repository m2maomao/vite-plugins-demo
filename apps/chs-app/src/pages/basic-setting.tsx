/**
 * 基本设置 — 改手机号 / 改调阅密码入口
 * 顶层路由（独立于 tabs 的「我的」页，避免嵌套布局问题）
 */
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export const routeMeta = {
  title: '基本设置',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'BasicSetting',
  setup() {
    const router = useRouter();

    return () => (
      <div class="min-h-screen bg-gray-50">
        <div class="bg-white divide-y divide-gray-50">
          <div
            class="flex items-center px-4 py-4 cursor-pointer active:bg-gray-50"
            onClick={() => router.push('/update-phone')}>
            <span class="flex-1 text-[15px]">更改手机号</span>
            <span class="text-gray-300">›</span>
          </div>
          <div
            class="flex items-center px-4 py-4 cursor-pointer active:bg-gray-50"
            onClick={() => router.push('/update-view-password')}>
            <span class="flex-1 text-[15px]">修改调阅密码</span>
            <span class="text-gray-300">›</span>
          </div>
        </div>
      </div>
    );
  },
});
