/**
 * 我的（tab）— 用户信息 + 功能入口
 */
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import { desensitizeData } from '@/utils/business';

export const routeMeta = {
  title: '我的',
  layout: 'tabs',
  auth: true,
  keepAlive: true,
};

export default defineComponent({
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    return () => (
      <div class="h-full bg-gray-50 overflow-y-auto pb-6">
        {/* 用户信息卡 */}
        <div class="bg-white px-4 pt-6 pb-4">
          <div class="flex items-center">
            <div class="w-14 h-14 rounded-full bg-[#096aff] text-white flex items-center justify-center text-xl shrink-0">
              {(userStore.user.name || '我').slice(0, 1)}
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="text-lg font-bold">{userStore.user.name || '请先登录'}</div>
              <div class="text-sm text-gray-400 mt-1 truncate">
                {userStore.user.phone ? desensitizeData(userStore.user.phone, 'phone') : '未登录'}
              </div>
            </div>
            {!userStore.isLoggedIn && (
              <button
                class="px-4 py-1.5 rounded bg-[#096aff] text-white text-sm shrink-0"
                onClick={() => router.push('/login/phone')}>
                立即登录
              </button>
            )}
          </div>
        </div>

        {/* 功能入口 */}
        <div class="mt-3 bg-white divide-y divide-gray-50">
          <div
            class="flex items-center px-4 py-4 cursor-pointer active:bg-gray-50"
            onClick={() => router.push('/realname-auth')}>
            <span class="flex-1 text-[15px]">实名认证</span>
            <span class="text-xs text-gray-400 mr-1">{userStore.user.authStatus === 2 ? '已认证' : '未认证'}</span>
            <span class="text-gray-300">›</span>
          </div>
          <div
            class="flex items-center px-4 py-4 cursor-pointer active:bg-gray-50"
            onClick={() => router.push('/family-members')}>
            <span class="flex-1 text-[15px]">家庭成员管理</span>
            <span class="text-gray-300">›</span>
          </div>
          <div
            class="flex items-center px-4 py-4 cursor-pointer active:bg-gray-50"
            onClick={() => router.push('/basic-setting')}>
            <span class="flex-1 text-[15px]">基本设置</span>
            <span class="text-gray-300">›</span>
          </div>
          <div
            class="flex items-center px-4 py-4 cursor-pointer active:bg-gray-50"
            onClick={() => router.push('/privacy-setting')}>
            <span class="flex-1 text-[15px]">隐私权限设置</span>
            <span class="text-gray-300">›</span>
          </div>
        </div>

        {/* 退出登录 */}
        {userStore.isLoggedIn && (
          <button
            class="mt-4 mx-4 w-[calc(100%-2rem)] py-3 rounded-lg bg-white text-red-500 text-base"
            onClick={() => {
              userStore.logout();
              router.push('/login/phone');
            }}>
            退出登录
          </button>
        )}
      </div>
    );
  },
});
