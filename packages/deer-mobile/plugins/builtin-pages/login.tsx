import { defineComponent, ref, h } from 'vue';
import { useStorage } from '@vueuse/core';
import { useApi } from 'deer-mobile/composables';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const { user } = useApi();
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const token = useStorage('token', '');

    const handleLogin = async () => {
      const res = await user.login({
        username: username.value,
        password: password.value
      });
      if (res.code === 0) {
        token.value = res.data.token;
        router.push('/');
      }
    }

    return () => (
      <div class="max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-lg">
        <h2 class="text-2xl text-center mb-6 font-bold">登录</h2>
        <div class="mb-4">
          <input
            placeholder="用户名" 
            value={username.value}
            onInput={(e: any) => username.value = e.target.value}
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          />
        </div>
        <div class="mb-4">
          <input
            placeholder="密码" 
            type="password"
            value={password.value}
            onInput={(e: any) => password.value = e.target.value}
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          />
        </div>
        <button
          onClick={handleLogin}
          class="w-full py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700"
        >
          登录
        </button>
      </div>
    )
  }
})