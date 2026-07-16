import { defineComponent, ref, h } from 'vue';
import { useUserStore } from 'deer-mobile/stores';

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const inputToken = ref('');

    const handleSetToken = () => {
      if (inputToken.value) {
        userStore.setToken(inputToken.value);
      }
    };

    const handleLogout = () => {
      userStore.logout();
    };

    return () => (
      <div class="max-w-sm mx-auto mt-10 p-6 border border-gray-200 rounded-lg">
        <h2 class="text-2xl text-center mb-6 font-bold">Pinia 调试页</h2>

        {/* 当前状态 */}
        <div class="mb-6 p-4 bg-gray-50 rounded">
          <p class="mb-2">
            <span class="font-bold">登录状态：</span>
            <span class={userStore.isLoggedIn ? 'text-green-600' : 'text-red-500'}>
              {userStore.isLoggedIn ? '已登录' : '未登录'}
            </span>
          </p>
          <p class="mb-2">
            <span class="font-bold">Token：</span>
            <code class="text-sm bg-gray-200 px-2 py-1 rounded break-all">
              {userStore.token || '(空)'}
            </code>
          </p>
        </div>

        {/* 设置 Token */}
        <div class="mb-4">
          <label class="block text-sm font-bold mb-2">设置 Token</label>
          <div class="flex gap-2">
            <input
              placeholder="输入 token..."
              value={inputToken.value}
              onInput={(e: Event) => inputToken.value = (e.target as HTMLInputElement).value}
              class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSetToken}
              class="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700"
            >
              设置
            </button>
          </div>
        </div>

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          class="w-full py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
        >
          退出登录
        </button>
      </div>
    );
  }
});
