/**
 * 我的健康档案 — 基础信息 + 健康信息双 Tab（查看/编辑模式）
 * 数据：queryPersonalArchive（查询）+ modPersonalArchive（更新）
 */
import { defineComponent, ref, onMounted, Fragment } from 'vue';
import { api } from 'virtual:api';
import { useUserStore } from '@/stores';

export const routeMeta = {
  title: '我的健康档案',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'HealthRecords',
  setup() {
    const userStore = useUserStore();
    const tabActive = ref(0);
    const mode = ref<'view' | 'edit'>('view');
    const loading = ref(false);
    const saving = ref(false);

    // 基础信息
    const baseForm = ref<any>({
      name: '',
      sex: 1,
      age: '',
      phone: '',
      idCard: '',
      address: '',
      relation: '本人',
    });
    // 健康信息
    const healthForm = ref<any>({
      height: '',
      weight: '',
      bloodType: '',
      allergyHistory: '',
      familyHistory: '',
      diseaseHistory: '',
    });

    async function load() {
      loading.value = true;
      try {
        const params: any = {};
        if (userStore.familyUser?.isFamily) params.familyId = userStore.familyUser.id;
        const res: any = await api.healthArchive.queryPersonalArchive(params);
        const data = res?.data || {};
        baseForm.value = {
          name: data.name ?? '',
          sex: data.sex ?? 1,
          age: data.age ?? '',
          phone: data.phone ?? '',
          idCard: data.idCard ?? '',
          address: data.resAdress ?? '',
          relation: '本人',
        };
        healthForm.value = {
          height: data.height ?? '',
          weight: data.weight ?? '',
          bloodType: data.bloodType ?? '',
          allergyHistory: (data.drugAllergyHistorys || []).join('、'),
          familyHistory: (data.familyHistorys || []).join('、'),
          diseaseHistory: (data.diseaseNames || []).join('、'),
        };
      } catch (e) {
        console.warn('[HealthRecords] 加载失败', e);
      } finally {
        loading.value = false;
      }
    }

    async function save() {
      saving.value = true;
      try {
        const params: any = {
          name: baseForm.value.name,
          sex: baseForm.value.sex,
          ...healthForm.value,
        };
        if (userStore.familyUser?.isFamily) params.familyId = userStore.familyUser.id;
        await api.healthArchive.modPersonalArchive(params);
        mode.value = 'view';
      } catch (e) {
        console.warn('[HealthRecords] 保存失败', e);
      } finally {
        saving.value = false;
      }
    }

    onMounted(load);

    const baseFields: Array<[string, string]> = [
      ['姓名', 'name'],
      ['性别', 'sex'],
      ['年龄', 'age'],
      ['手机号', 'phone'],
      ['身份证号', 'idCard'],
      ['现住址', 'address'],
      ['与本人关系', 'relation'],
    ];

    const healthFields: Array<[string, string]> = [
      ['身高(cm)', 'height'],
      ['体重(kg)', 'weight'],
      ['血型', 'bloodType'],
      ['过敏史', 'allergyHistory'],
      ['家族史', 'familyHistory'],
      ['既往病史', 'diseaseHistory'],
    ];

    const renderFields = (fields: Array<[string, string]>, form: any) => (
      <div class="bg-white rounded-lg divide-y divide-gray-100">
        {fields.map(([label, key]) => (
          <div key={key} class="flex items-center justify-between p-4">
            <span class="text-sm text-gray-500 shrink-0">{label}</span>
            {mode.value === 'view' ? (
              <span class="text-sm text-gray-800 text-right">{form[key] || '-'}</span>
            ) : (
              <input
                value={form[key]}
                class="flex-1 ml-3 text-sm text-right text-gray-800 outline-none"
                onInput={(e: any) => (form[key] = e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    );

    return () => (
      <div class="min-h-screen bg-gray-50">
        {/* Tab */}
        <div class="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div class="flex">
            {['基础信息', '健康信息'].map((label, i) => (
              <button
                key={label}
                class={`flex-1 py-3 text-sm font-medium transition-colors ${tabActive.value === i ? 'text-[#096aff] border-b-2 border-[#096aff]' : 'text-gray-500'}`}
                onClick={() => (tabActive.value = i)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading.value && <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>}

        {!loading.value && (
          <div class="p-4 space-y-4">
            {tabActive.value === 0
              ? renderFields(baseFields, baseForm.value)
              : renderFields(healthFields, healthForm.value)}

            {/* 底部操作 */}
            <div class="flex gap-2 pt-2">
              {mode.value === 'view' ? (
                <button
                  class="flex-1 py-3 rounded-lg bg-[#096aff] text-white text-sm font-medium"
                  onClick={() => (mode.value = 'edit')}>
                  编辑
                </button>
              ) : (
                <>
                  <button
                    class="flex-1 py-3 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium"
                    onClick={() => (mode.value = 'view')}>
                    取消
                  </button>
                  <button
                    class="flex-1 py-3 rounded-lg bg-[#096aff] text-white text-sm font-medium disabled:opacity-50"
                    disabled={saving.value}
                    onClick={save}>
                    {saving.value ? '保存中...' : '保存'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
});
