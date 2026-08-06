/**
 * 隐私权限设置 — 隐私数据查询/更新
 */
import { defineComponent, ref, onMounted } from 'vue';
import { api } from 'virtual:api';

export const routeMeta = {
  title: '隐私权限设置',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'PrivacySetting',
  setup() {
    const list = ref<any[]>([]);
    const loading = ref(false);

    async function load() {
      loading.value = true;
      try {
        const res: any = await api.user.queryPrivacyData({});
        const data = res?.data || {};
        const items = data.list || data.privacyList || [];
        list.value = items.length
          ? items
          : [
              { name: '姓名', allow: 1 },
              { name: '手机号', allow: 1 },
              { name: '身份证号', allow: 0 },
              { name: '家庭住址', allow: 0 },
              { name: '健康档案', allow: 1 },
            ];
      } catch (e) {
        console.warn('[PrivacySetting] 加载失败', e);
      } finally {
        loading.value = false;
      }
    }

    async function toggle(item: any) {
      item.allow = item.allow === 1 ? 0 : 1;
      try {
        await api.user.updatePrivacyData({
          privacyList: list.value.map((i) => ({ name: i.name, allow: i.allow })),
        });
      } catch {
        item.allow = item.allow === 1 ? 0 : 1;
      }
    }

    onMounted(load);

    return () => (
      <div class="min-h-screen bg-gray-50">
        <div class="p-4 text-sm text-gray-400">开启后，家庭成员可查看对应的健康档案隐私数据</div>
        <div class="bg-white divide-y divide-gray-50">
          {list.value.map((item) => (
            <div key={item.name} class="flex items-center justify-between px-4 py-4">
              <span class="text-[15px]">{item.name}</span>
              <button
                class={`relative w-11 h-6 rounded-full transition-colors ${item.allow === 1 ? 'bg-[#096aff]' : 'bg-gray-200'}`}
                onClick={() => toggle(item)}>
                <span
                  class={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${item.allow === 1 ? 'left-[22px]' : 'left-0.5'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
