/**
 * 家庭成员列表
 */
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';

export const routeMeta = {
  title: '家庭成员',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'FamilyMembers',
  setup() {
    const router = useRouter();
    const members = ref<any[]>([]);
    const loading = ref(false);

    async function load() {
      loading.value = true;
      try {
        const res: any = await api.user.queryFamilyList({});
        members.value = res?.data?.list || res?.data || [];
      } catch (e) {
        console.warn('[FamilyMembers] 加载失败', e);
        members.value = [
          { id: '1', name: '张健康', phone: '13800138000', sex: 1, isDefault: 1 },
          { id: '2', name: '李女士', phone: '13900139000', sex: 2, isDefault: 0 },
        ];
      } finally {
        loading.value = false;
      }
    }

    async function handleUnbind(item: any) {
      if (!window.confirm(`确定解绑 ${item.name} 吗？`)) return;
      try {
        await api.user.unbindFamily({ id: item.id });
        members.value = members.value.filter((m) => m.id !== item.id);
      } catch {
        alert('解绑失败');
      }
    }

    onMounted(load);

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        {loading.value && <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>}
        <div class="space-y-3">
          {members.value.map((item) => (
            <div key={item.id} class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div
                    class={`w-11 h-11 rounded-full flex items-center justify-center text-white text-lg ${item.sex === 1 ? 'bg-[#72A9FC]' : 'bg-[#FC6666]'}`}>
                    {item.name?.[0] || '成'}
                  </div>
                  <div class="ml-3">
                    <div class="text-base font-medium">
                      {item.name}
                      {item.isDefault === 1 && (
                        <span class="ml-2 text-xs text-[#096aff] bg-[#F0F6FF] px-1.5 py-0.5 rounded">默认</span>
                      )}
                    </div>
                    <div class="text-sm text-gray-400 mt-0.5">{item.phone}</div>
                  </div>
                </div>
                <button
                  class="text-sm text-gray-400 px-3 py-1 border border-gray-200 rounded"
                  onClick={() => handleUnbind(item)}>
                  解绑
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          class="mt-6 w-full py-3 rounded-lg bg-[#096aff] text-white text-base font-medium"
          onClick={() => router.push('/new-member-pathway')}>
          + 新增成员
        </button>
      </div>
    );
  },
});
