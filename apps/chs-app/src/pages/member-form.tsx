/**
 * 新增/编辑家庭成员表单
 * query mode=form（手动填写）/ ocr（身份证识别）/ edit（编辑）
 */
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'virtual:api';
import { getIdcardInfo } from '@/utils/business';

export const routeMeta = {
  title: '成员信息',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'MemberForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const mode = String(route.query.mode || 'form');
    const memberId = route.query.id ? String(route.query.id) : '';

    const form = ref<any>({
      name: '',
      phone: '',
      sex: 1,
      idCard: '',
      relation: '配偶',
      address: '',
    });
    const saving = ref(false);

    async function loadEdit() {
      if (!memberId) return;
      try {
        const res: any = await api.user.queryFamilyData({ id: memberId });
        form.value = { ...form.value, ...(res?.data || {}) };
      } catch (e) {
        console.warn('[MemberForm] 加载失败', e);
      }
    }

    function applyOcrInfo(info: any) {
      if (!info) return;
      form.value.name = info.name || form.value.name;
      form.value.idCard = info.idCard || form.value.idCard;
      if (info.idCard) {
        const parsed = getIdcardInfo(info.idCard);
        if (parsed.sex) form.value.sex = parsed.sex === '男' ? 1 : 2;
      }
    }

    async function handleSubmit() {
      if (!form.value.name) {
        alert('请输入姓名');
        return;
      }
      saving.value = true;
      try {
        await api.user.saveFamily({ ...form.value, id: memberId || undefined });
        alert(memberId ? '修改成功' : '添加成功');
        router.back();
      } catch {
        alert('保存失败，请重试');
      } finally {
        saving.value = false;
      }
    }

    onMounted(loadEdit);

    const renderField = (label: string, key: string, placeholder: string, type = 'text') => (
      <div>
        <div class="text-sm text-gray-500 mb-1">{label}</div>
        <input
          value={form.value[key]}
          type={type}
          maxlength={key === 'idCard' ? 18 : undefined}
          class="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none"
          placeholder={placeholder}
          onInput={(e: any) => (form.value[key] = e.target.value)}
        />
      </div>
    );

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        <div class="bg-white rounded-lg p-4 space-y-4">
          {renderField('姓名', 'name', '请输入成员姓名')}
          {renderField('手机号', 'phone', '请输入手机号', 'tel')}
          {renderField('身份证号', 'idCard', '请输入身份证号')}
          <div>
            <div class="text-sm text-gray-500 mb-1">性别</div>
            <div class="flex gap-4">
              {[1, 2].map((s) => (
                <label key={s} class="flex items-center text-sm">
                  <input
                    type="radio"
                    checked={form.value.sex === s}
                    class="mr-1 accent-[#096aff]"
                    onChange={() => (form.value.sex = s)}
                  />
                  {s === 1 ? '男' : '女'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">与本人关系</div>
            <select
              value={form.value.relation}
              class="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none"
              onChange={(e: any) => (form.value.relation = e.target.value)}>
              {['配偶', '父亲', '母亲', '子女', '其他'].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {renderField('现住址', 'address', '请输入现住址')}
        </div>

        {mode === 'ocr' && (
          <div class="mt-4 p-4 bg-[#F0F6FF] rounded-lg text-sm text-gray-500">
            提示：OCR 方式录入的身份证信息已自动回填，请核对并补充
          </div>
        )}

        <button
          class="mt-6 w-full py-3 rounded-lg bg-[#096aff] text-white text-base font-medium disabled:opacity-50"
          disabled={saving.value}
          onClick={handleSubmit}>
          {saving.value ? '保存中...' : memberId ? '保存修改' : '确认添加'}
        </button>
      </div>
    );
  },
});
