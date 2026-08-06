/**
 * 安全验证 — 调阅密码 / 短信验证码双模式
 */
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export const routeMeta = {
  title: '安全验证',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'SecurityVerification',
  setup() {
    const router = useRouter();
    const isPassword = ref(true);
    const inputValue = ref('');
    const codeText = ref('获取验证码');
    const countdown = ref(0);
    let timer: any = null;

    const config = {
      password: {
        title: '您正在调阅健康档案，请输入6位安全密码，以验证身份',
        subtitle: '您可在设置中查看/修改安全密码',
        switchText: '验证码验证',
      },
      code: {
        title: '您正在调阅健康档案，请输入6位安全验证码，以验证身份',
        subtitle: '验证码已发送至您的手机短信',
        switchText: '密码验证',
      },
    };

    const useConfig = () => config[isPassword.value ? 'password' : 'code'];

    function handleSendCode() {
      if (countdown.value > 0) return;
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
    }

    function handleFinish() {
      router.back();
    }

    function handleSwitch() {
      isPassword.value = !isPassword.value;
      inputValue.value = '';
    }

    const cfg = useConfig();

    return () => (
      <div class="min-h-screen bg-gray-50">
        <div class="bg-white p-4">
          <div class="text-base text-gray-800">{cfg.title}</div>
          <div class="mt-3 mb-8 text-sm text-gray-400">{cfg.subtitle}</div>

          {/* 6 位输入 */}
          <div class="flex gap-2 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                class={`flex-1 h-12 rounded-lg border text-center leading-12 text-lg ${inputValue.value[i] ? 'border-[#096aff]' : 'border-gray-200'}`}>
                {inputValue.value[i] ? <span class="text-2xl leading-12">·</span> : <span>&nbsp;</span>}
              </div>
            ))}
          </div>
          {/* 隐藏输入框驱动 */}
          <input
            value={inputValue.value}
            type="password"
            maxlength={6}
            inputmode="numeric"
            class="w-full h-10 px-3 rounded-lg bg-gray-50 text-center text-lg outline-none"
            placeholder="请输入6位密码/验证码"
            onInput={(e: any) => {
              inputValue.value = e.target.value.replace(/\D/g, '');
            }}
            onKeyup={(e: KeyboardEvent) => {
              if (inputValue.value.length === 6) handleFinish();
            }}
          />

          {/* 发送验证码 */}
          {!isPassword.value && (
            <div class="flex justify-center mt-4">
              <button class="text-[#096aff]" onClick={handleSendCode}>
                {codeText.value}
              </button>
            </div>
          )}
        </div>

        {/* 切换模式 */}
        <div class="flex justify-center mt-8">
          <button
            class="flex items-center px-7 py-2 border border-gray-300 rounded-3xl bg-white text-sm text-gray-700"
            onClick={handleSwitch}>
            {cfg.switchText}
          </button>
        </div>
      </div>
    );
  },
});
