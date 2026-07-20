import { defineComponent, ref, h } from 'vue';
import { useApi } from 'deer-mobile/composables';
import { useRouter } from 'vue-router';
import { useUserStore } from 'deer-mobile/stores';

export default defineComponent({
  setup() {
    const { user } = useApi();
    const router = useRouter();
    const userStore = useUserStore();
    const username = ref('');
    const password = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
      if (loading.value) return;
      loading.value = true;
      try {
        const res = await user.login({
          username: username.value,
          password: password.value,
        });
        if (res.code === 0) {
          userStore.setToken(res.data.token);
          router.push('/');
        }
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <div className="max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-2xl text-center mb-6 font-bold">登录</h2>
        <div className="mb-4">
          <input
            placeholder="用户名"
            value={username.value}
            onInput={(e: Event) => {
              const target = e.target as HTMLInputElement;
              username.value = target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="mb-4">
          <input
            placeholder="密码"
            type="password"
            value={password.value}
            onInput={(e: Event) => {
              const target = e.target as HTMLInputElement;
              password.value = target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading.value}
          className="w-full py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading.value ? '登录中...' : '登录'}
        </button>
      </div>
    );
  },
});
