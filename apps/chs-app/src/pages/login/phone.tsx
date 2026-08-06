/**
 * 手机号密码登录页
 */
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';
import { useUserStore } from '@/stores';
import { sm4 } from 'sm-crypto';

export const routeMeta = {
  title: '登录',
  layout: 'blank',
  auth: false,
};

// TODO: 对齐 @sm/sm-manage 的 encryptManageDataECB（key / mode）
const SM4_KEY = '0123456789abcdeffedcba9876543210';

export default defineComponent({
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const phone = ref('');
    const password = ref('');
    const protocol = ref(false);
    const loading = ref(false);
    const errorMsg = ref('');

    const handleLogin = async () => {
      if (!phone.value || !password.value) {
        errorMsg.value = '请输入手机号和密码';
        return;
      }
      if (!protocol.value) {
        errorMsg.value = '请先同意用户协议';
        return;
      }
      loading.value = true;
      errorMsg.value = '';
      try {
        const res: any = await api.login.phoneLogin({
          phone: phone.value,
          passward: sm4.encrypt(password.value, SM4_KEY, { mode: 'ecb' }),
        });
        const { token } = res.data || {};
        const user = { ...(res.data || {}) };
        delete user.token;
        userStore.setUser(user);
        userStore.setToken(token);
        router.push('/');
      } catch (e) {
        console.error('[Login] 登录失败', e);
        errorMsg.value = '登录失败，请重试';
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <div class="min-h-screen bg-white flex flex-col px-6 pt-20">
        <div class="mb-10 text-center">
          <div class="text-2xl font-bold text-gray-800">CHS 健康服务</div>
          <div class="mt-2 text-sm text-gray-400">居民健康服务平台</div>
        </div>

        <input
          value={phone.value}
          type="tel"
          maxlength={11}
          placeholder="手机号"
          class="w-full px-3 py-3 mb-4 bg-gray-50 rounded-lg text-base outline-none"
          onInput={(e: any) => (phone.value = e.target.value)}
        />
        <input
          value={password.value}
          type="password"
          placeholder="密码"
          class="w-full px-3 py-3 mb-2 bg-gray-50 rounded-lg text-base outline-none"
          onInput={(e: any) => (password.value = e.target.value)}
          onKeydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter') handleLogin();
          }}
        />

        {errorMsg.value && <div class="text-sm text-red-500 mt-1">{errorMsg.value}</div>}

        <button
          class="mt-6 w-full py-3 rounded-lg bg-[#096aff] text-white text-base font-medium disabled:opacity-50"
          disabled={loading.value}
          onClick={handleLogin}>
          {loading.value ? '登录中...' : '登录'}
        </button>

        <div class="mt-5 text-center text-sm text-gray-500">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              checked={protocol.value}
              class="mr-1 accent-[#096aff]"
              onChange={(e: any) => (protocol.value = e.target.checked)}
            />
            <span>我已阅读并同意</span>
            <a
              class="text-[#096aff]"
              onClick={(e: Event) => {
                e.preventDefault();
                router.push('/agreement');
              }}>
              《用户协议》
            </a>
          </label>
        </div>
      </div>
    );
  },
});
