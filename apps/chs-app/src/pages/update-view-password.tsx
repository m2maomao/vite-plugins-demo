/**
 * 修改调阅密码
 */
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';

export const routeMeta = {
  title: '修改调阅密码',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'UpdateViewPassword',
  setup() {
    const router = useRouter();
    const oldPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);

    async function handleSubmit() {
      if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        alert('请填写完整');
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        alert('两次输入的新密码不一致');
        return;
      }
      if (newPassword.value.length !== 6) {
        alert('调阅密码为 6 位数字');
        return;
      }
      loading.value = true;
      try {
        await api.user.updateAccessPassward({
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        });
        alert('修改成功');
        router.back();
      } catch {
        alert('修改失败，请重试');
      } finally {
        loading.value = false;
      }
    }

    const renderInput = (label: string, value: any, setter: (v: string) => void, placeholder: string) => (
      <div>
        <div class="text-sm text-gray-500 mb-1">{label}</div>
        <input
          value={value}
          type="password"
          maxlength={6}
          inputmode="numeric"
          class="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none"
          placeholder={placeholder}
          onInput={(e: any) => setter(e.target.value.replace(/\D/g, ''))}
        />
      </div>
    );

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        <div class="bg-white rounded-lg p-4 space-y-4">
          {renderInput('原密码', oldPassword.value, (v) => (oldPassword.value = v), '请输入原 6 位调阅密码')}
          {renderInput('新密码', newPassword.value, (v) => (newPassword.value = v), '请输入新 6 位调阅密码')}
          {renderInput('确认新密码', confirmPassword.value, (v) => (confirmPassword.value = v), '请再次输入新密码')}
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
