/**
 * 信息认证 — 姓名 + 身份证号二要素 / 短信验证码
 * OCR 识别结果通过 query 回填（source=ocr）
 */
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'virtual:api';
import { useUserStore } from '@/stores';
import { getIdcardInfo } from '@/utils/business';

export const routeMeta = {
  title: '信息认证',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'RealnameAuth',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const form = ref<any>({
      name: '',
      phone: userStore.user?.phone || '',
      idCard: '',
      verificationCode: '',
    });
    const codeText = ref('获取验证码');
    const countdown = ref(0);
    const submitting = ref(false);
    let timer: any = null;

    onMounted(() => {
      // OCR 模式回填
      if (route.query.source === 'ocr') {
        const info = route.query as any;
        if (info.name) form.value.name = info.name;
        if (info.idCard) form.value.idCard = info.idCard;
      }
    });

    function handleSendCode() {
      if (countdown.value > 0) return;
      api.user
        .sendingShortMessage({
          userAuthId: userStore.user?.userAuthId || '',
          name: userStore.user?.name || '',
          phone: form.value.phone,
          verifyType: 5,
        })
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
      if (!form.value.name || !form.value.idCard || !form.value.verificationCode) {
        alert('请填写完整信息');
        return;
      }
      // 身份证格式校验
      const parsed = getIdcardInfo(form.value.idCard);
      if (!parsed.birthday) {
        alert('身份证号格式不正确');
        return;
      }
      submitting.value = true;
      try {
        const res: any = await api.login.realnameAuth({
          userAuthId: userStore.user?.userAuthId || '',
          name: form.value.name,
          idCard: form.value.idCard,
          phone: form.value.phone,
          verificationCode: form.value.verificationCode,
        });
        userStore.setUser({ ...userStore.user, ...(res?.data || {}) });
        alert('实名认证成功');
        router.back();
      } catch {
        alert('认证失败，请重试');
      } finally {
        submitting.value = false;
      }
    }

    const renderField = (label: string, key: string, placeholder: string, type = 'text', disabled = false) => (
      <div>
        <div class="text-sm text-gray-500 mb-1">{label}</div>
        <input
          value={form.value[key]}
          type={type}
          maxlength={key === 'idCard' ? 18 : undefined}
          disabled={disabled}
          class={`w-full px-3 py-2.5 rounded-lg text-base outline-none ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}`}
          placeholder={placeholder}
          onInput={(e: any) => (form.value[key] = e.target.value)}
        />
      </div>
    );

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        <div class="mb-4 text-sm text-gray-400">请提交本人真实身份信息，否则功能将无法正常使用</div>

        <div class="bg-white rounded-lg p-4 space-y-4">
          {renderField('真实姓名', 'name', '请输入真实姓名')}
          {renderField('手机号', 'phone', '手机号', 'tel', true)}
          {renderField('身份证号', 'idCard', '请输入身份证号')}
          <div>
            <div class="text-sm text-gray-500 mb-1">验证码</div>
            <div class="flex gap-2">
              <input
                value={form.value.verificationCode}
                type="number"
                maxlength={6}
                class="flex-1 px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none"
                placeholder="请输入验证码"
                onInput={(e: any) => (form.value.verificationCode = e.target.value.replace(/\D/g, ''))}
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

        {/* OCR 入口 */}
        <div
          class="mt-3 bg-white rounded-lg p-4 flex items-center justify-between cursor-pointer"
          onClick={() => router.push('/realname-ocr')}>
          <div>
            <div class="text-[15px]">拍照识别（OCR）</div>
            <div class="text-sm text-gray-400 mt-0.5">上传身份证照片自动识别信息</div>
          </div>
          <span class="text-gray-300">›</span>
        </div>

        <button
          class="mt-6 w-full py-3 rounded-lg bg-[#096aff] text-white text-base font-medium disabled:opacity-50"
          disabled={submitting.value}
          onClick={handleSubmit}>
          {submitting.value ? '提交中...' : '确认'}
        </button>
      </div>
    );
  },
});
