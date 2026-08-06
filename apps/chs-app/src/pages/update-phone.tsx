/**
 * 更改手机号 — 短信验证
 */
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';
import { useUserStore } from '@/stores';

export const routeMeta = {
  title: '更改手机号',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'UpdatePhone',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const phone = ref('');
    const code = ref('');
    const codeText = ref('获取验证码');
    const countdown = ref(0);
    const loading = ref(false);
    let timer: any = null;

    function handleSendCode() {
      if (!phone.value || phone.value.length !== 11) {
        alert('请输入正确的手机号');
        return;
      }
      if (countdown.value > 0) return;
      api.user
        .sendingShortMessage({ phone: phone.value, verifyType: 3 })
        .then(() => {
          countdown.value = 60;
          codeText.value = '60秒重新获取';
          timer = setInterval(() => {
            countdown.value -= 1;
            if (countdown.value <= 0) {
              clearInterval(timer);
              codeText.value = '重新获取';
            } else {
              codeText.value = `${countdown.value}秒重新获取`;
            }
          }, 1000);
        })
        .catch(() => undefined);
    }

    async function handleSubmit() {
      if (!phone.value || !code.value) {
        alert('请填写完整');
        return;
      }
      loading.value = true;
      try {
        await api.user.updatePhone({ phone: phone.value, verificationCode: code.value });
        userStore.setUser({ ...userStore.user, phone: phone.value });
        alert('手机号修改成功');
        router.back();
      } catch {
        alert('修改失败，请重试');
      } finally {
        loading.value = false;
      }
    }

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        <div class="bg-white rounded-lg p-4 space-y-4">
          <div>
            <div class="text-sm text-gray-500 mb-1">新手机号</div>
            <input
              value={phone.value}
              type="tel"
              maxlength={11}
              class="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none"
              placeholder="请输入新手机号"
              onInput={(e: any) => (phone.value = e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">验证码</div>
            <div class="flex gap-2">
              <input
                value={code.value}
                type="number"
                maxlength={6}
                class="flex-1 px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none"
                placeholder="请输入验证码"
                onInput={(e: any) => (code.value = e.target.value.replace(/\D/g, ''))}
              />
              <button
                class="shrink-0 px-4 py-2.5 rounded-lg text-sm text-[#096aff] border border-[#096aff] disabled:opacity-50"
                disabled={countdown.value > 0}
                onClick={handleSendCode}>
                {codeText.value}
              </button>
            </div>
          </div>
        </div>
        <button
          class="mt-6 w-full py-3 rounded-lg bg-[#096aff] text-white text-base font-medium disabled:opacity-50"
          disabled={loading.value}
          onClick={handleSubmit}>
          {loading.value ? '提交中...' : '确认修改'}
        </button>
      </div>
    );
  },
});
