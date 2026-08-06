/**
 * 用户协议页
 */
import { defineComponent } from 'vue';

export const routeMeta = {
  title: '用户协议',
  layout: 'blank',
  auth: false,
};

export default defineComponent({
  setup() {
    return () => (
      <div class="min-h-screen bg-white px-6 py-8 text-sm text-gray-600 leading-6">
        <h1 class="text-lg font-bold text-center mb-6 text-gray-800">用户协议</h1>
        <p class="mb-4">欢迎使用 CHS 健康服务。在使用本服务前，请仔细阅读本协议。</p>
        <p class="mb-4">一、服务说明：本平台为居民提供健康档案、健康宣教、家医沟通等健康服务。</p>
        <p class="mb-4">二、用户信息：您应提供真实、准确的个人信息，我们承诺依法保护您的隐私。</p>
        <p class="mb-4">三、使用规范：请勿利用本平台从事任何违法违规活动。</p>
        <p class="mb-4">四、免责声明：因不可抗力或第三方原因导致的服务中断，本平台不承担相应责任。</p>
        <p>（完整协议内容待补充）</p>
      </div>
    );
  },
});
