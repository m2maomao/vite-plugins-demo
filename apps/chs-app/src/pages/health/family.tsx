/**
 * 健康档案 — 切换成员
 * 家庭成员列表 + 当前使用标识，点击切换 familyUser
 */
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';
import { useUserStore } from '@/stores';

export const routeMeta = {
  title: '切换成员',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'HealthFamily',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const members = ref<any[]>([]);
    const loading = ref(false);

    const useUser = () => (userStore.familyUser?.isFamily ? userStore.familyUser : userStore.user);

    async function getData() {
      loading.value = true;
      try {
        const res: any = await api.user.queryFamilyList({});
        members.value = (res?.data?.list || res?.data || []).map((item: any) => ({
          ...item,
          avatar: item.sex === 1 ? 'user/avatar-man.svg' : 'user/avatar-woman.svg',
        }));
      } catch (e) {
        console.warn('[HealthFamily] 加载失败', e);
        // mock 兜底（无后端时展示假数据）
        members.value = [
          { id: '1', name: '张健康', phone: '13800138000', sex: 1 },
          { id: '2', name: '李女士', phone: '13900139000', sex: 2 },
        ];
      } finally {
        loading.value = false;
      }
    }

    function handleSelectedUser(item: any) {
      // 切换当前使用成员
      userStore.setFamilyUser(item.isFamily === false ? null : { ...item, isFamily: true });
      router.back();
    }

    onMounted(getData);

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        {loading.value && <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>}
        {members.value.map((item) => (
          <div
            key={item.id}
            class="flex flex-col mb-3 p-4 rounded-lg bg-white"
            onClick={() => handleSelectedUser(item)}>
            <div class="flex justify-between text-sm">
              <div class="flex items-center">
                <div class="relative">
                  <div
                    class={`w-11 h-11 rounded-full flex items-center justify-center text-white text-lg ${item.sex === 1 ? 'bg-[#72A9FC]' : 'bg-[#FC6666]'}`}>
                    {item.name?.[0] || '成'}
                  </div>
                </div>
                <div class="flex flex-col justify-between ml-3">
                  <div class="text-base font-bold leading-6">{item.name}</div>
                  <div class="flex items-center mt-1 text-sm text-gray-500">{item.phone}</div>
                </div>
              </div>
              {useUser()?.id === item.id && <div class="text-[#096aff] text-xs self-center">当前使用</div>}
            </div>
          </div>
        ))}
      </div>
    );
  },
});
