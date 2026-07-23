import { defineComponent, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'deer-mobile/stores';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const username = ref('');
    const password = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
      if (loading.value) return;
      loading.value = true;
      try {
        const token = 'demo-token-' + Date.now();
        // 同时写入 Pinia store 和 localStorage（auth 守卫从 localStorage 读取）
        userStore.setToken(token);
        localStorage.setItem('token', token);
        await router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <div class="max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-lg">
        <h2 class="text-2xl text-center mb-6 font-bold">登录</h2>
        <div class="mb-4">
          <input
            placeholder="用户名"
            value={username.value}
            onInput={(e: Event) => {
              username.value = (e.target as HTMLInputElement).value;
            }}
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          />
        </div>
        <div class="mb-4">
          <input
            placeholder="密码"
            type="password"
            value={password.value}
            onInput={(e: Event) => {
              password.value = (e.target as HTMLInputElement).value;
            }}
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading.value}
          class="w-full py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading.value ? '登录中...' : '登录'}
        </button>
      </div>
    );
  },
});
